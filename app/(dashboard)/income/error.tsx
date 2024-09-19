'use client'

import React from 'react'
import { toast } from 'sonner'

function ErrorPage(error:any) {
  return (
    <div>
      {toast.error(error.error.message)}
    </div>
  )
}

export default ErrorPage
