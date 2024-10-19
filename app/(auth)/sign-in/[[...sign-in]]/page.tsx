import { SignIn, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'


function SignInPage() {
  return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <div className='pt-8 text-center'>
          <h1 className='text-3xl font-bold text-muted-foreground'>Welcome Back</h1>
          <p className='text-sm text-muted-foreground'>Sign in to return to your dashboard</p>
        </div>
      <div className='mt-8'>
          <ClerkLoaded>
            <SignIn path='/sign-in' />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2  className='animate-spin text-muted-foreground'/>
          </ClerkLoading>
      </div>
      </div>
  )
}

export default SignInPage
