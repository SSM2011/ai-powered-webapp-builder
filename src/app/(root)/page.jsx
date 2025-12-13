import ProjectsForm from '@/modules/home/componenets/project-form'
import Image from 'next/image'
import React from 'react'

const Page = () => {
  return (
    <div className='flex items-center justify-center w-full px-4 py-8'>
      <div className='max-w-5xl w-full'>
        <section className='space-y-8 flex flex-col items-center'>
          <div className='flex flex-col items-center'>
            <Image
              src="/logo.svg"
              alt="GenForge"
              width={182}
              height={182}
              className="dark:invert hidden md:block"
            />
          </div>
          <h1 className="text-2xl md:text-5xl font-bold text-center">Build apps at the speed of thought ⚡</h1>
          <p className="mx-auto max-w-3xl text-center text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed md:leading-relaxed">
            GenForge lets you turn ideas into production-ready web applications using AI.
          </p>

          <div className="max-w-3xl w-full">
            <ProjectsForm/>
          </div>

        </section>
      </div>
    </div>
  )
}

export default Page
