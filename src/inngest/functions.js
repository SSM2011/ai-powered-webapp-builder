import { inngest } from "./client";
import { openai, createAgent, createTool, createNetwork } from "@inngest/agent-kit";
import Sandbox from "@e2b/code-interpreter";
import z from "zod";
import { SYSTEM_PROMPT } from "@/prompt";
import { lastAssistantTextMessageContent } from "./utils";

export const codeAgentFuntion = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    // Create a new sandbox for each run
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("v0-nextjs-build-new-v2");
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "code-agent",
      description: "An expert coding agent",
      system: SYSTEM_PROMPT,
      model: openai({ model: "gpt-4o" }),
      tools: [
        // 1. terminal
        createTool({
          name: "terminal",
          description: "use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await Sandbox.connect(sandboxId);

                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data) => {
                    buffers.stderr += data;
                  },
                });
                return result.stdout;
              } catch (error) {
                console.log(
                  `Command failed: ${error} \n stdout: ${buffers.stdout}\n stderr: ${buffers.stderr}`
                );
                return `Command failed: ${error} \n stdout: ${buffers.stdout}\n stderr: ${buffers.stderr}`;
              }
            });
          },
        }),

        // 2. createOrUpdateFiles
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or Update files in the Sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async ({ files }, { step, network }) => {
            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  const updatedFiles = network?.state?.data.files || {};
                  const sandbox = await Sandbox.connect(sandboxId);

                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }

                  return updatedFiles;
                } catch (error) {
                  return "Error" + error;
                }
              }
            );

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),

        // 3. readFiles
        createTool({
          name: "readFiles",
          description: "Read files in the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await Sandbox.connect(sandboxId);

                const contents = [];

                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (error) {
                return "Error" + error;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        },
      },
    });

    const network = createNetwork({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 10,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          return;
        }

        return codeAgent;
      },
    });

    // 1. Ensure the user prompt is sent to the LLM
    const userPrompt = event.data?.value || "";
    const result = await network.run(userPrompt);

    // 2. Generate valid Next.js + Tailwind JSX for a landing page
    const landingPageAgent = createAgent({
      name: "landing-page-agent",
      description: "Generates a Next.js + Tailwind landing page component",
      system:
        "You generate a single Next.js App Router page component in TypeScript.\n" +
        "Return ONLY the full contents of `page.tsx` as valid React JSX using Tailwind CSS classes.\n" +
        "Do not include markdown, explanations, comments, file paths, or backticks.",
      model: openai({ model: "gpt-4o" }),
    });

    const { output: landingOutput } = await landingPageAgent.run(
      `Create a beautiful, responsive landing page for the following product or idea using Next.js (App Router) and Tailwind CSS. 
The page should include a hero section, key features, a call-to-action, and a footer. 
User prompt: "${userPrompt}"`
    );

    const landingPageCode =
      Array.isArray(landingOutput) && landingOutput[0]?.content
        ? landingOutput[0].content
        : "";

    // 3. Overwrite the sandbox file app/page.tsx (and src/app/page.tsx) with the generated JSX
    await step.run("write-landing-page", async () => {
      const sandbox = await Sandbox.connect(sandboxId);
      const targetPaths = ["app/page.tsx", "src/app/page.tsx"];

      for (const path of targetPaths) {
        try {
          await sandbox.files.write(path, landingPageCode);
        } catch (error) {
          // Ignore errors for paths that don't exist in the template
        }
      }
    });

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await Sandbox.connect(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    return {
      url: sandboxUrl,
      title: "Untitled",
      files: result?.state?.data?.files,
      summary: result?.state?.data?.summary,
    };
  }
);