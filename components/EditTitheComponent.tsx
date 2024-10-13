import CreateTitheRecord from '@/app/forms/create-tithe-form'
import { useConfirmDelete } from '@/app/hooks/use-confirm-delete'
import { useEditTitheHook } from '@/app/hooks/use-edit-tithe-hook'
import { TitheType } from '@/app/types/types'
import { Dialog, DialogOverlay, DialogContent } from '@/components/ui/dialog'
import { useDeleteTitheMutation } from '@/features/tithes/api/use-delete-tithe-mutation'
import { useEditTitheMutation } from '@/features/tithes/api/use-edit-tithe-mutation'
import { useGetTithe } from '@/features/tithes/api/use-get-tithe'
import { Loader2 } from 'lucide-react'


function EditTitheComponent ()
{
    const { id, isOpen, onClose } = useEditTitheHook()
    const { data, isLoading } = useGetTithe( id! )
    const { mutate, isPending } = useEditTitheMutation( id )
    const [DeleteAlertComponent, confirm] = useConfirmDelete(
        "Are you sure?",
        `You are about to remove the tithe record with ID ${id} permanently. Click on 'Cancel' to terminate the process or 'Continue' to proceed and remove the record.`
    )

    const {mutate: deleteMutation} = useDeleteTitheMutation(id)

    const defaultValues = {
        ...data,
        amount: data?.amount!,
        paymentDate: new Date( data?.paymentDate! ),
        paymentMethod: data?.paymentMethod!,
        memberId: data?.memberId!
    }
    
    if ( isLoading ) {
        return <span className='absolute top-[50%] left-[50%]'>
            <Loader2 className='animate-spin' />
        </span>
    }

    function handleSubmit ( values: TitheType )
    {
        mutate( values, {
            onSuccess: () =>
            {
                onClose()
            }
        })
    }

    async function handleDelete ()
    {
        const ok = await confirm()
        if ( ok ) {
            deleteMutation( { id: id }, {
                onSuccess: () =>
                {
                    onClose()
                }
            })
        }
    }
    
  return (
      <>
          <DeleteAlertComponent />
          <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay>
              <DialogContent>
                  <CreateTitheRecord
                      onSubmit={ handleSubmit }
                      id={ id }
                      defaultValues={ defaultValues }
                      disabled={isPending}
                      onDelete={handleDelete}
                  />
              </DialogContent>
        </DialogOverlay>
        </Dialog>
      </>
  )
}

export default EditTitheComponent
