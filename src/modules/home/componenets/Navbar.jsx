import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'

import { Button } from '@/components/ui/button'

const Navbar = () => {
  return (
    <nav className="p-4 bg-transparent fixed top-0 left-0 right-0 z-50 border-b border-transparent">
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
        
        <Image
  src="/logo.svg"
  alt="GenForge"
  width={82}
  height={82}
  className="dark:invert"
/>


        {/* When user is logged OUT */}
        <SignedOut>
          <div className="flex gap-2">
            <SignInButton>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </SignInButton>

            <SignUpButton>
              <Button variant="outline" size="sm">
                Sign Up
              </Button>
            </SignUpButton>
          </div>
        </SignedOut>

        {/* When user is logged IN */}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

      </div>
    </nav>
  )
}

export default Navbar
