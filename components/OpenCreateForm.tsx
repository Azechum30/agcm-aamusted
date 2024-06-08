'use client'

import { Button } from "./ui/button"
import useCreateForm from "@/app/hooks/use-create-form"


function OpenCreateForm (  )
{
 
  const { setIsOpen } = useCreateForm()
  
  return (
    <>
      <Button variant='default' onClick={()=>setIsOpen()}>
        Add a new Member
      </Button>
    </>
  )
}

export default OpenCreateForm
