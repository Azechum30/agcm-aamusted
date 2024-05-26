import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
import React, { ReactNode } from 'react'


function DashboarLayout({children}:{children: ReactNode}) {
  return (
      <div className='flex'>
        <Sidebar />
        <main className='flex-[100%] sm:flex-[6] overflow-hidden'>
        <MobileNav />
            <div className='px-6 py-10 main-content'>
              {children}
            </div>
        </main>
      </div>
  )
}

export default DashboarLayout
