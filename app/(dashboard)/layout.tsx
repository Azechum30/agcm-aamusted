import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
import React, { ReactNode } from 'react'


function DashboarLayout({children, modal}:{children: ReactNode, modal: ReactNode}) {
  return (
      <div className='flex'>
        <Sidebar />
        <main className='flex-[100%] sm:flex-[6] overflow-hidden'>
        <MobileNav />
        {modal}
            <div className='px-6 py-10 main-content'>
              {children}
            </div>
        </main>
      </div>
  )
}

export default DashboarLayout
