"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextAreaAutosize from 'react-textarea-autosize'
import { ArrowUpIcon, Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from '@/components/ui/form'

const formSchema = z.object({
  content: z
    .string()
    .min(1, "Project description is required")
    .max(1000, "Description is too long"),
})

const PROJECT_TEMPLATES = [
  {
    emoji: "⚡",
    title: "Instant SaaS Builder",
    prompt:
      "Build a modern SaaS web application with authentication, dashboard, and responsive UI using the latest web technologies.",
  },
  {
    emoji: "🚀",
    title: "Startup Landing Page",
    prompt:
      "Create a high-converting startup landing page with hero section, features, pricing, testimonials, and call-to-action buttons.",
  },
  {
    emoji: "🧠",
    title: "AI Dashboard",
    prompt:
      "Generate an AI-powered dashboard that displays analytics, charts, user activity, and real-time data in a clean UI.",
  },
  {
    emoji: "🛠️",
    title: "Admin Panel",
    prompt:
      "Build a secure admin panel with user management, role-based access control, CRUD operations, and modern design.",
  },
  {
    emoji: "📦",
    title: "Product Builder",
    prompt:
      "Create a full-stack product management web app with authentication, database integration, and scalable architecture.",
  },
]

const ProjectsForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { content: "" },
  })

  const contentValue = form.watch("content")
  const isEmpty = !contentValue || contentValue.trim().length === 0

  const handleTemplate = (prompt) => {
    form.setValue("content", prompt, { shouldFocus: true })
  }

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true)
      console.log(values)
      toast.success("Project generation started ⚡")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-20 space-y-14">
      {/* Prompt Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative rounded-xl border bg-background p-4"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextAreaAutosize
                    {...field}
                    minRows={4}
                    maxRows={10}
                    placeholder="Describe the web app you want to build…"
                    className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || isEmpty}
              className={cn(
                "gap-1 transition",
                (isSubmitting || isEmpty) && "opacity-60 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUpIcon className="h-4 w-4" />
              )}
              Generate
            </Button>
          </div>
        </form>
      </Form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or
          </span>
        </div>
      </div>

      {/* Templates Section */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Start with a template
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECT_TEMPLATES.map((template, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleTemplate(template.prompt)}
              className="group rounded-xl border bg-background p-4 text-left transition hover:border-foreground/20 hover:bg-accent"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{template.emoji}</span>
                <div>
                  <h3 className="font-medium leading-none">
                    {template.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {template.prompt}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectsForm
