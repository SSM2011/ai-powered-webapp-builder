import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { codeAgentFuntion } from "../../../inngest/functions";

// Ensure this route runs in the Node.js runtime (not Edge)
export const runtime = "nodejs";

// Create an API that serves Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [codeAgentFuntion],
});