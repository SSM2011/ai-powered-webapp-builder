import { inngest } from "../../../inngest/client";
import { openai, createAgent } from "@inngest/agent-kit";



export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "agent/hello" },
  async ({ event, step }) => {
    const helloAgent = createAgent({
      name:"Hello-agent",
      description:"A simple agent that say hello",
      system:"You are a helpful assistant that always greet with enthusiasm",
      model: openai({model: "gpt-4o-mini"})
    })

    const {output} = await helloAgent.run("Say Hello to the user!")

    return{
      message: output[0].content
    }

  },
);