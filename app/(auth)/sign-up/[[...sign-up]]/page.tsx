import { SignUp, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'


function SignUpPage() {
  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2 py-10'>
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-muted-foreground'>Welcome Back</h1>
          <p className='text-sm text-muted-foreground'>Sign in or create an account to return your dashboard</p>
        </div>
      <div className='mt-8'>
          <ClerkLoaded>
            <SignUp path='/sign-up'/>
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2  className='animate-spin text-muted-foreground'/>
          </ClerkLoading>
      </div>
      </div>
      <div className='h-screen bg-gray-200 dark:bg-zinc-800 hidden lg:flex justify-center items-center flex-col relative'
      >
        <div className='w-[400px] h-screen bg-white dark:bg-black shadow-2xl absolute top-0 right-0 bottom-0 z-10'></div>
         <Image src='/aamusted-agcm-logo.png'  alt='logo' width={300} height={300} className='border-[48px] rounded-full border-white dark:border-black z-50 w-64 h-64 object-cover'/>
      </div>
    </div>
  )
}

export default SignUpPage
