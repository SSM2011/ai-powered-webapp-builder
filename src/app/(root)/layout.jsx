import { onBoardUser } from '@/modules/auth/actions'
import React from 'react'

const Layout = async ({ children }) => {
    await onBoardUser();
    return (
        <main className="flex flex-col min-h-screen relative overflow-x-hidden bg-background">

            <div
                className="fixed inset-0 -z-10
                bg-background
                bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)]
                dark:bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)]
                bg-size-[16px_16px]"
            />



            <div className='flex-1 w-full mt-20'>
                {children}
            </div>



        </main>
    )
}

export default Layout
