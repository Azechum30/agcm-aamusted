import { LoaderPinwheel } from 'lucide-react'
import React from 'react'

function LoadingPage() {
  return (
    <div className='flex w-full h-screen justify-center items-center'>
      <LoaderPinwheel className='size-6 animate-spin' />
    </div>
  )
}

export default LoadingPage
