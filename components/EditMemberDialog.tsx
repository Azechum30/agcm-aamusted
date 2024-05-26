
import CreateMember from '@/app/forms/create-member-form'
import { Dispatch, SetStateAction } from 'react';
import { useCreateMember } from '@/features/members/api/use-create-member';
import { MemberType } from '@/app/types/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { useEditMemberDialog } from '@/app/hooks/use-open-form';
import { useGetMember } from '@/features/members/api/use-get-member';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEditMember } from '@/features/members/api/use-edit-member';
import { useConfirmBulkDelete } from '@/app/hooks/use-confirm-bulk-delete';
import { useDeleteMember } from '@/features/members/api/use-delete-member';

type Props = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}


type gender = 'male' | 'female'
type departments = 'prayer' | 'music' | 'protocol' | 'evangelism'

function EditMemberDialog ()
{
  
  const { isOpen, onClose, id } = useEditMemberDialog()
  const {mutate, isPending} = useEditMember(id)

  const { data, isLoading } = useGetMember( id )
  const [ BulkDeleteDialog, confirm ] = useConfirmBulkDelete(
    "Are you sure?",
    "You are about to delete this member permanently from the system. Click on 'Cancel' to abort the process or 'Continue' to delete the member's data."
  );

  const { mutate:deleteMutation, isPending: isDeletePending} = useDeleteMember(id)

  const formattedDate = new Date(`${data?.dateOfBirth}`).toDateString()
  
const defaultValues = {
        firstName: data?.firstName || '',
        lastName: data?.lastName || '',
        middleName: data?.middleName || '',
        gender:  data?.gender as gender || undefined,
        dateOfBirth: new Date(formattedDate) || new Date(),
        hostel: data?.hostel || '',
        course:  data?.course || '',
        hometown:  data?.hometown || '',
        department:  data?.department as departments || undefined,
        phoneNumber: data?.phoneNumber || '',
        email: data?.email || '',
        entryYear: String(data?.entryYear) ||  '2020',
        imageUrl: data?.imageUrl || '',
        imageFile:  undefined

    } satisfies MemberType
  function handleSubmit (values: MemberType)
  {
    mutate(
      {...values, dateOfBirth: values.dateOfBirth.toISOString() },
      {
        onSuccess: () =>
        {
          onClose()
        }
      }
    )
  }

  async function onDelete ()
  {
    const ok = await confirm();
    if ( ok ) {
      deleteMutation( { id }, {
        onSuccess: () =>
        {
         onClose()
       }})
    }
  }

  return (
    <>
      <BulkDeleteDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="border-none  overflow-y-auto">
        <SheetHeader>
          <SheetTitle className='text-xl font-bold uppercase text-center'>
            Edit Member Profile
          </SheetTitle>
          <SheetDescription className='max-w-prose text-center'>
              You can edit your profile here and the changes would be saved. 
          </SheetDescription>
        </SheetHeader>
        {
          isLoading ? (<Loader2 className='size-6 animate-spin text-muted-foreground' />):
            <>
              <Image src={ data?.imageUrl || '/noAvatar.png' } alt='profile picture' className='w-96 h-96 object-cover mt-4 rounded-md' width={ 100 } height={ 100 } />
              <CreateMember onSubmit={handleSubmit} defaultValues={defaultValues} disabled={isPending || isDeletePending } id={Number(id)} onDelete={onDelete}  />
            </>
        }
      </SheetContent>
    </Sheet>
    </>
  )
}

export default EditMemberDialog
