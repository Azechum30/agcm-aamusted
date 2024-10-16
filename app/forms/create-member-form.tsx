'use client'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { MemberSchema, MemberType } from '../types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import DatePicker from '@/components/DatePicker'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import LoadingButton from '@/components/LoadingButton'


type CreateMemberProps = {
    id?: number
    defaultValues?: MemberType,
    onSubmit: ( values: MemberType ) => void,
    disabled?: boolean,
    onDelete?: () => void,
    
}

function CreateMember ({id, defaultValues, onSubmit, onDelete, disabled}:CreateMemberProps)
{
    const form = useForm<MemberType>( {
        resolver: zodResolver( MemberSchema ),
        defaultValues: defaultValues
    } ) 
    

    async function handleSubmit ( data: MemberType )
    {
        onSubmit( data )
    }
  return (
      <Form { ...form }>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full space-y-2 p-4 border rounded-md mt-6 bg-gray-100 dark:bg-inherit last:space-y-6'>
              <div className='flex flex-col md:flex-row md:items-center gap-3'>
                  <FormField control={ form.control } name='firstName' render={ ( { field } ) => (
                  <FormItem>
                      <FormLabel className='text-sm'>First Name</FormLabel>
                      <FormControl>
                          <Input {...field} className='bg-white dark:bg-inherit' />
                          </FormControl>
                          <FormMessage />
                  </FormItem>
              )} />
                  <FormField control={ form.control } name='lastName' render={ ( { field } ) => (
                  <FormItem>
                      <FormLabel className='text-sm'>Last Name</FormLabel>
                      <FormControl>
                          <Input {...field} className='bg-white dark:bg-inherit' />
                          </FormControl>
                          <FormMessage />
                  </FormItem>
              )} />
              </div>
              <div className='flex flex-col md:flex-row md:items-center gap-3'>
                  <FormField control={ form.control } name='middleName' render={ ( { field } ) => (
                  <FormItem className='flex-1'>
                      <FormLabel className='text-sm'>Middle Name</FormLabel>
                      <FormControl>
                          <Input {...field} className='bg-white dark:bg-inherit' />
                          </FormControl>
                          <FormMessage />
                  </FormItem>
              )} />
                  <FormField control={ form.control } name='gender' render={ ( { field } ) => (
                  <FormItem className='flex-1'>
                      <FormLabel className='text-sm'>Gender/Sex</FormLabel>
                          <Select value={field.value}  onValueChange={field.onChange}>
                              <SelectTrigger className='bg-white dark:bg-inherit w-full'>
                                  <SelectValue placeholder='Choose your gender' />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectGroup>
                                      <SelectLabel>Gender/Sex</SelectLabel>
                                      <SelectItem value='male'>Male</SelectItem>
                                      <SelectItem value='female'>Female</SelectItem>
                                  </SelectGroup>
                              </SelectContent>
                          </Select>
                          <FormMessage />
                  </FormItem>
              )} />
              </div>
              <div className='flex flex-col md:flex-row md:items-center gap-3'>
                  <FormField control={ form.control } name='email' render={ ( { field } ) => (
                  <FormItem className='flex-1'>
                      <FormLabel className='text-sm'>Email</FormLabel>
                      <FormControl>
                          <Input {...field} type='email' className='bg-white dark:bg-inherit' />
                          </FormControl>
                          <FormMessage />
                  </FormItem>
              )} />
                  <FormField control={ form.control } name='phoneNumber' render={ ( { field } ) => (
                  <FormItem className='flex-1'>
                      <FormLabel className='text-sm'>Phone Number</FormLabel>
                          <FormControl>
                              <Input {...field} className='bg-white dark:bg-inherit' />
                          </FormControl>
                          <FormMessage />
                  </FormItem>
              )} />
              </div>
              <div className='flex flex-col md:flex-row md:items-center gap-3'>
                  <FormField control={ form.control } name='dateOfBirth' render={ ( { field } ) => (
                  <FormItem className='flex-1'>
                      <FormLabel className='text-sm'>Date of Birth</FormLabel>
                          <DatePicker date={ field.value } setDate={ field.onChange } />
                          <FormMessage />
                  </FormItem>
              )} />
                  <FormField control={ form.control } name='entryYear' render={ ( { field } ) => (
                  <FormItem className='flex-1'>
                      <FormLabel className='text-sm'>Entry year</FormLabel>
                          <FormControl>
                              <Input {...field} className='bg-white dark:bg-inherit' />
                          </FormControl>
                          <FormMessage />
                  </FormItem>
              )} />
              </div>
              <div className='flex flex-col md:flex-row md:items-center gap-3'>
                  <FormField control={ form.control } name='department' render={ ( { field } ) => (
                  <FormItem className='flex-1'>
                      <FormLabel className='text-sm'>Department</FormLabel>
                      <Select value={field.value}  onValueChange={field.onChange}>
                        <SelectTrigger className='bg-white dark:bg-inherit w-full'>
                            <SelectValue placeholder='Choose your department' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Departments</SelectLabel>
                                <SelectItem value='prayer'>Prayer</SelectItem>
                                <SelectItem value='evangelism'>Evangelism</SelectItem>
                                <SelectItem value='protocol'>Protocol</SelectItem>
                                <SelectItem value='music'>Music</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                          </Select>
                          <FormMessage />
                  </FormItem>
              )} />
                  <FormField control={ form.control } name='hostel' render={ ( { field } ) => (
                  <FormItem className='flex-1'>
                      <FormLabel className='text-sm'>Hostel/Hall</FormLabel>
                          <FormControl>
                              <Input {...field}  className='bg-white dark:bg-inherit' />
                          </FormControl>
                          <FormMessage />
                  </FormItem>
              )} />
              </div>
              <div className='flex flex-col md:flex-row md:items-center gap-3'>
                  <FormField control={ form.control } name='hometown' render={ ( { field } ) => (
                  <FormItem className='flex-1'>
                      <FormLabel className='text-sm'>Hometown</FormLabel>
                          <FormControl>
                              <Input {...field} className='bg-white dark:bg-inherit'/>
                          </FormControl>
                          <FormMessage />
                  </FormItem>
              )} />
                  <FormField control={ form.control } name='course' render={ ( { field } ) => (
                  <FormItem className='flex-1'>
                      <FormLabel className='text-sm'>Programme/Course</FormLabel>
                          <FormControl>
                              <Input {...field}  className='bg-white dark:bg-inherit' />
                          </FormControl>
                          <FormMessage />
                  </FormItem>
              )} />
              </div>
              <div className='flex flex-col md:flex-row md:items-center gap-3'>
                  <FormField control={ form.control } name='agcmTribe' render={ ( { field } ) => (
                      <FormItem className='flex-1'>
                          <FormLabel className='text-sm'>AGCM Tribe</FormLabel>
                          <FormControl>
                              <Input
                                  { ...field }
                                  className='bg-white dark:bg-inherit'
                              />
                          </FormControl>
                      </FormItem>
                  )} />
                  <FormField control={ form.control } name='imageFile' render={ ( { field } ) => (
                  <FormItem className='flex-1'>
                      <FormLabel className='text-sm'>Profile Image</FormLabel>
                          <FormControl>
                              <Input 
                                  className='bg-white dark:bg-inherit'
                                  type='file'
                                  accept='.jpg, .png, .jpeg'
                                  onChange={(event)=>field.onChange(event.target.files && event.target.files[0])}
                              />
                          </FormControl>
                          <FormMessage />
                  </FormItem>
                  ) } />
                  
              </div>
                {
                  disabled ? <LoadingButton /> :
                  <Button
                     className='w-full'
                  >
                    { id ? 'Save Changes' : 'Create Member' } 
                 </Button>    
               }

              { !!id && (
                  <Button
                      type='button'
                      variant='secondary'
                      className='w-full'
                      onClick={ onDelete }
                      disabled={disabled}
                  >
                      <Trash2 className='size-4 mr-2' />
                      Delete
                  </Button>
              ) }
          </form>
    </Form>
  )
}

export default CreateMember
