
'use client'
import { useCreateTithe } from "@/app/hooks/use-create-tithe"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"

function OpenTitheForm ()
{
    const {onOpen} = useCreateTithe()
  return (
      <Button
        variant='blue'
        className="w-full md:w-auto"
        size='sm'
        onClick={ onOpen }>
        <Plus strokeWidth={2} className="size-4 mr-1" />
        Add New
      </Button>
    
  )
}

export default OpenTitheForm
