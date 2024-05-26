import Link from "next/link"
import { linkData } from "../lib/constants"
import Image from "next/image"
import { UserButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

function Sidebar() {
  return (
    <div className='flex-1 bg-gray-100 dark:bg-inherit dark:border-r flex flex-col gap-2 py-4 px-2 sm:px-6 h-screen sidebar sm:sticky sm:top-0 sm:left-0 z-[50]'>
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
      { linkData.map( linkcategory => (
        <div
          key={ linkcategory.category }
          className="capitalize border-b border-b-gray-400/25 dark:border-b-gray-100/5 py-4 last:border-none"
        >
            <h4 className="font-bold text-center text-xs sm:text-base sm:text-left">{ linkcategory.category }</h4>
            <div className="flex flex-col gap-y-3 mt-3 ">
            { linkcategory.links.map( link => (
              <Link
                key={ link.text }
                href={ link.path }
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-sm justify-center sm:justify-start"
              >
                <span>{ link.icon }</span>
                <span className="hidden sm:block">{link.text}</span>
              </Link>
            ))}
          </div>
        </div>
      ) ) }
      <div className="mt-4 flex flex-col gap-y-4">
        <h2 className="font-bold text-base">User</h2>
        <div className="px-4 flex items-center gap-2">
          <ClerkLoaded>
            <UserButton afterSignOutUrl="/sign-in" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2  className='size-4 animate-spin text-muted-foreground'/>
          </ClerkLoading>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
