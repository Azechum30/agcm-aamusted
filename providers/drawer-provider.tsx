'use client'
import DrawerComponent from "@/components/DrawerComponent"
import EditMemberDialog from "@/components/EditMemberDialog"

function DrawerProvider ()
{
    
  return (
    <>
      <DrawerComponent />
      <EditMemberDialog />
    </>
  )
}

export default DrawerProvider
