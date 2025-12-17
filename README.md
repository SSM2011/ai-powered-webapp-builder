# AI Powered Web App Builder

AI Powered Web App Builder is a full-stack Next.js application that generates production-ready web applications from natural language prompts. The project focuses on system design, prompt engineering, and real-world cloud deployment.

## Features
- Natural language to web application generation
- Structured multi-file output (pages and components)
- Prompt validation and error handling
- Clean, developer-focused UI inspired by modern SaaS tools

## Tech Stack
- Framework: Next.js 
- AI: OpenAI / Gemini APIs
- Deployment: Entire application deployed on AWS EC2 using Nginx and PM2

## Status
Actively under development with core functionality implemented.

## Inspiration
Inspired by developer tools such as Vercel v0, Lovable, and Replit.



## Setup
```bash
git clone https://github.com/SSM2011/ai-powered-app-builder.git
npm install
setup docker desktop on machine and start the docker engine
npm run dev

```

## .env 
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5431/aiappbuild?schema=public"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
OPENAI_API_KEY=
```