
import Image from 'next/image'
import { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetHeader } from './ui/sheet'
import { AlignJustify, Loader2 } from 'lucide-react'
import { linkData } from '@/lib/constants'
import Link from 'next/link'
import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs'
import {currentUser} from '@clerk/nextjs/server'



async function MobileNav ()
{
  const user = await currentUser()
  return (
    <div className='flex justify-between items-center mobilenav border-b px-4 shadow-md mb-4 sticky top-0 z-50 h-16 bg-gray-100 dark:bg-zinc-900'>
        <div className='flex gap-2 items-center'>
            <Image 
                src='/aamusted-agcm-logo.png'
                alt='Agcm logo'
                width={ 40 }
                height={ 40 }
                className='w-8 h-8 object-cover border-2 dark:border-gray-100 rounded-full'
            />
        </div>
        <Sheet>
            <SheetTrigger>
                <AlignJustify />
            </SheetTrigger>
              <SheetContent side='left' className=' w-64 flex flex-col gap-y-4 border-none  '>
                  <SheetHeader>
                      <SheetTitle>
                        <div className='flex -items-center gap-2 border-b border-b-gray-400/15 dark:border-b-gray-200/10 pb-4'>
                            <Image src='/aamusted-agcm-logo.png' alt='Agcm logo' width={ 40 } height={ 40 } className='w-8 h-8 object-cover' />
                            <h2 className='text-xl font-bold tracking-tight'>AGCM</h2>
                        </div>
                      </SheetTitle>
                  </SheetHeader>
                  { linkData.map( data => (
                      <div key={ data.category } className='capitalize border-b last-of-type:border-none border-b-gray-400/20 dark:border-gray-200/10 py-2'>
                          <h4 className='font-bold mb-2'>{ data.category }</h4>
                          { data.links.map( link => (
                              <SheetClose asChild key={ link.text } className='mb-2 dark:hover:bg-gray-600 hover:bg-gray-200 rounded-md'>
                                  <Link
                                      href={ link.path }
                                      className='flex gap-2 items-center px-4 py-2 text-sm'
                                  >
                                    <span>{ link.icon }</span>
                                    <span>{link.text}</span>
                                  </Link>
                              </SheetClose>
                          ))}
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
            </SheetContent>
        </Sheet>
    </div>
  )
}

export default MobileNav
