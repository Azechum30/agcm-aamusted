
'use client'
import { useCreateTithe } from "@/app/hooks/use-create-tithe"
import { Button } from "./ui/button"

function OpenTitheForm ()
{
    const {onOpen} = useCreateTithe()
  return (
    <>
      <Button type="submit" onClick={onOpen}>Add Tithe</Button>
    </>
  )
}

export default OpenTitheForm
