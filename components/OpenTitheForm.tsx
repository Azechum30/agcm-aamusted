
'use client'
import { useCreateTithe } from "@/app/hooks/use-create-tithe"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"

function OpenTitheForm ()
{
    const {onOpen} = useCreateTithe()
  return (
    <>
      <Button variant='blue' className="w-full md:w-auto" type="submit" onClick={ onOpen }>
        <Plus strokeWidth={2} className="size-4 mr-1" />
        Add a new Tithe Record
      </Button>
    </>
  )
}

export default OpenTitheForm
