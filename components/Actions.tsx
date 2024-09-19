import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useEditMemberDialog } from "@/app/hooks/use-open-form"
import { useDeleteMember } from "@/features/members/api/use-delete-member"
import { useConfirmBulkDelete } from "@/app/hooks/use-confirm-bulk-delete"

type Props = {
    id: string
}

function Actions ( { id }: Props )
{
  const { onOpen, } = useEditMemberDialog()
  const { mutate, isPending } = useDeleteMember( String(id) );
  const [BulkDeleteDialog, confirm] = useConfirmBulkDelete(
    'Are you sure?',
    'You are about to delete this member permanently from the system. Kindly click on "Cancel" to abort the process or "Continue" to delete the member\'s data. '
  )

  async function onDelete ()
  {
    const ok = await confirm();
    if ( ok ) {
      mutate({ id: String(id) })
    }
  }

  return (
    <>
      <BulkDeleteDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className="size-8 p-0">
                <MoreHorizontal className="size-4 text-muted-foreground" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='center'>
            <DropdownMenuLabel className='text-sm'>
                Actions
            </DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={ false }
            onClick={ () => { onOpen( String( id ) ) } }
          >
                <Edit className='size-4 mr-2' />
                Edit
            </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={ false }
            onClick={ onDelete }
          >
                <Trash2 className='size-4 mr-2' />
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default Actions
