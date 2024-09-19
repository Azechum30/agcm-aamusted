import CreateMember from '@/app/forms/create-member-form'
import { useCreateMember } from '@/features/members/api/use-create-member';
import { MemberType } from '@/app/types/types';
import useCreateForm from '@/app/hooks/use-create-form';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';


const defaultValues = {
        firstName: '',
        lastName: '',
        middleName: '',
        gender: undefined,
        dateOfBirth: new Date(),
        hostel: '',
        course: '',
        hometown: '',
        department: undefined,
        phoneNumber: '',
        email: '',
        entryYear: '2020',
        imageUrl: '',
        imageFile: undefined

    } satisfies MemberType

function DrawerComponent ()
{
  

  const {isOpen, onClose} = useCreateForm()

  const { mutate, isPending } = useCreateMember()
  
  

  function handleSubmit (values: MemberType)
  {
    mutate( {
      ...values,
      dateOfBirth: values.dateOfBirth.toISOString()
    }, {
      onSuccess: () => {
       onClose()
     }
   } )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="border-none  overflow-y-auto">
        <SheetHeader>
          <SheetTitle className='text-xl font-bold uppercase text-center'>
            Add a new Member
          </SheetTitle>
          <SheetDescription className='max-w-prose text-center'>
              Kindly fill the form to add a new member to the system. Required fields must be filled.
          </SheetDescription>
        </SheetHeader>
        <CreateMember onSubmit={handleSubmit} defaultValues={defaultValues} disabled={isPending} />
      </SheetContent>
    </Sheet>
  )
}

export default DrawerComponent
