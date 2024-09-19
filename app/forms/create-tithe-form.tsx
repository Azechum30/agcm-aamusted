
'use client'

import { Form, FormControl, FormLabel, FormField, FormItem, FormMessage, FormDescription } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem} from '@/components/ui/select'
import { TitheSchema, type TitheType } from '../types/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import DatePicker from '@/components/DatePicker'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { Loader2, Trash2 } from 'lucide-react'
import LoadingButton from '@/components/LoadingButton'

type Props = {
    id?: string
    onSubmit: (data: TitheType) => void,
    disabled?: boolean,
    defaultValues?: TitheType
    onDelete?: ()=> void

}

function CreateTitheRecord ( { id, onSubmit, disabled, defaultValues, onDelete }: Props )
{
    const form = useForm<TitheType>( {
        resolver: zodResolver( TitheSchema ),
        defaultValues: defaultValues
    } )

    const {data, isLoading} = useGetMembers()
    
    function handleSubmit ( values: TitheType )
    {
        
        onSubmit(values)
    }
  return (
      <Form {...form}>
          <form onSubmit={ form.handleSubmit( handleSubmit ) } className='w-full space-y-2 p-4 border rounded-md mt-6 bg-gray-100 dark:bg-inherit first-of-type:space-y-6 last-of-type:space-y-6'>
              <div className='mb-3 text-center'>
                  <h1 className='text-xl font-bold uppercase mb-1'>
                      {!!id ? ' Edit Tithe Record': 'Add A New Tithe Record' }
                  </h1>
                  <FormDescription>
                      {!!id ? 'Make changes and save to update the tithe record!' : 'Fill out the out the form to create a new tithe record'}
                  </FormDescription>
              </div>
              <div className='flex flex-col md:flex-row gap-3 md:items-center'>
                  <FormField control={ form.control } name='amount' render={ ( { field } ) => (
                  <FormItem className='flex-1'>
                      <FormLabel className='flex items-center gap-2'><span>Amount</span><span className='text-red-400'>*</span> </FormLabel>
                      <FormControl>
                          <Input
                              { ...field }
                              className='shadow-none bg-white focus-visible:ring-0 outline-none'
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )} /><FormField control={ form.control } name='paymentDate' render={ ( { field } ) => (
                  <FormItem className='flex-1'>
                      <FormLabel className='flex items-center gap-2'><span>Payment Date</span> <span className='text-red-400'>*</span></FormLabel>
                      <FormControl>
                          <DatePicker date={field.value}  setDate={field.onChange} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
              </div><div className='flex flex-col md:flex-row gap-3 md:items-center'>
                  <FormField control={ form.control } name='paymentMethod' render={ ( { field } ) => (
                  <FormItem className='flex-1'>
                      <FormLabel className='flex items-center gap-2'><span>Payment Method</span> <span className='text-red-400'>*</span></FormLabel>
                      <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className='bg-white shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-0'>
                                      <SelectValue placeholder='Select Payment method' />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value='cash'>Cash</SelectItem>
                                      <SelectItem value='bank transfer'>Bank Transfer</SelectItem>
                                      <SelectItem value='cheque'>Cheque</SelectItem>
                                      <SelectItem value='mobile transfer'>Mobile Transfer</SelectItem>
                                  </SelectContent>
                          </Select>
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )} /><FormField control={ form.control } name='memberId' render={ ( { field } ) => (
                  <FormItem className='flex-1'>
                      <FormLabel className='flex items-center gap-2'> <span>Payee&apos;s Name </span> <span className='text-red-400'>*</span></FormLabel>
                      <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className='bg-white shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-0 focus:ring-0'>
                                      <SelectValue placeholder="Select Payee's Name" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      { isLoading ? <Loader2 className='animate-spine' /> : (
                                          data?.map( person => (
                                              <SelectItem key={ person.id } value={ person.id }>
                                                  {person.firstName} {person.lastName}
                                              </SelectItem>
                                          ))
                                      )}
                                  </SelectContent>
                          </Select>
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
              </div>
              <div className='flex flex-col gap-3'>
                  { disabled ? <LoadingButton /> : (
                      <Button className='w-full' type='submit' variant='blue' >
                          {!!id ? 'Save' : 'Submit'}
                      </Button>
                  ) }
                  
                  { !!id && (
                      <Button
                          className='w-full'
                          type='button'
                          variant='destructive'
                          size='sm'
                          onClick={onDelete}
                      >
                          <Trash2 className='size-4 mr-1' />
                          Delete
                      </Button>
                  )}
              </div>
          </form>
    </Form>
  )
}

export default CreateTitheRecord
