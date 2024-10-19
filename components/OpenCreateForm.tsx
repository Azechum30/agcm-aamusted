'use client'

import { Plus, PlusCircle } from "lucide-react"
import { Button } from "./ui/button"
import useCreateForm from "@/app/hooks/use-create-form"


function OpenCreateForm (  )
{
 
  const { setIsOpen } = useCreateForm()
  
  return (
    <>
      <Button variant='blue' size='sm' onClick={ () => setIsOpen() }>
        <Plus className='size-4 mr-1' />
        Add New
      </Button>
    </>
  )
}

export default OpenCreateForm
