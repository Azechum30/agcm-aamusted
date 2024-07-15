'use client'

import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog'
import {ScrollArea}  from '@/components/ui/scroll-area'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

function Modal ( { children }: { children: ReactNode } )
{
    const router = useRouter()
    const handleOpenChange = () =>
    {
        router.back()
    }
  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
        <DialogOverlay>
            <DialogContent className='max-w-4xl h-screen overflow-auto'>
                {children}
            </DialogContent>
        </DialogOverlay>
    </Dialog>
  )
}

export default Modal
