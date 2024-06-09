'use client'
import Link from "next/link"
import { linkData } from "../lib/constants"
import Image from "next/image"
import { UserButton, ClerkLoaded, ClerkLoading, useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"


 function Sidebar ()
{

   const { user } = useUser()
   const pathname = usePathname()
  
  return (
    <div className='flex-1 bg-gray-100 dark:bg-inherit dark:border-r flex flex-col gap-2 py-4 px-2 sm:px-6 h-screen sidebar sticky top-0 left-0 z-[50] overflow-y-auto'>
       <Link href='/'>
        <div className="flex items-center gap-2 border-b border-b-gray-400/25 dark:border-b-gray-100/5 pb-4 justify-center sm:justify-start">
            <Image
            src='/aamusted-agcm-logo.png'
            width={ 40 }
            height={ 40 }
            className="w-8 h-8 object-cover"
            alt="Agcm logo"
          />
          <h2 className="hidden sm:block font-bold text-xl tracking-tight">AGCM</h2>
          </div>
      </Link>
      { linkData.map( linkcategory => (
        <div
          key={ linkcategory.category }
          className="capitalize border-b border-b-gray-400/25 dark:border-b-gray-100/5 py-4 last:border-none"
        >
            <h4 className="font-bold text-center text-xs sm:text-base sm:text-left">{ linkcategory.category }</h4>
            <div className="flex flex-col border-l mt-3 ">
            { linkcategory.links.map( link => (
              <Link
                key={ link.text }
                href={ link.path }
                className={cn('flex items-center px-4 gap-3 py-2 mb-2 last-of-type:mb-0  hover:bg-gray-200 dark:hover:bg-gray-600 text-sm justify-center sm:justify-start', pathname === link.path && 'border-l border-l-gray-800 bg-gray-200')}
              >
                <span>{ link.icon }</span>
                <span className="hidden sm:block">{link.text}</span>
              </Link>
            ))}
          </div>
        </div>
      ) ) }
      <div>
        <div className="mt-2 flex gap-3 items-center">
            <ClerkLoaded>
                <UserButton afterSignOutUrl="/sign-in" />
            </ClerkLoaded>
            <h2 className="text-sm capitalize">{user?.firstName}</h2>
        </div>
        <ClerkLoading>
            <Loader2  className='size-4 animate-spin text-muted-foreground'/>
        </ClerkLoading>
      </div>
    </div>
  )
}

export default Sidebar
