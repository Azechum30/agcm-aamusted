import
    {
        DropdownMenu,
        DropdownMenuItem,
        DropdownMenuContent,
        DropdownMenuLabel,
        DropdownMenuTrigger
    } from '@/components/ui/dropdown-menu'
import { Button } from './ui/button'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { useEditTitheHook } from '@/app/hooks/use-edit-tithe-hook'
import { useConfirmDelete } from '@/app/hooks/use-confirm-delete'
import { useDeleteTitheMutation } from '@/features/tithes/api/use-delete-tithe-mutation'


type Props = {
    id: string
}

function TitheActions ( { id }: Props )
{
    const { onOpen, onClose } = useEditTitheHook()
    const [DeleteAlertComponent, confirm] = useConfirmDelete(
        "Are you sure?",
        `You are about to remove the tithe record with ID ${id} permanently. Click on the 'Cancel' button to terminate the process or the 'Continue' button to proceed. `
    )
    const {mutate} = useDeleteTitheMutation(id)

    async function handleDelete ()
    {
        const ok = await confirm()
        if ( ok ) {
            mutate( { id: id }, {
                onSuccess: () =>
                {
                    onClose()
                }
            })
        }
    }
  return (
      <>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='size-6'>
                  <MoreHorizontal className='size-4 text-muted-foreground' />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                  <Button variant='ghost' size='sm' onClick={()=> { onOpen(id) }}>
                      <Edit className='size-4 mr-1 text-blue-400' />
                      Edit
                  </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                      <Button
                          variant='ghost' size='sm'
                          onClick={handleDelete}
                    >
                                <Trash2 className='size-4 mr-1' />
                            Delete
                        </Button>
                  </DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
        <DeleteAlertComponent />
    </>
  )
}

export default TitheActions
