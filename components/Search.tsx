'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormField, FormItem } from './ui/form';

import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';



const FormSchema = z.object( {
    search: z.string( { required_error: "search a term is required!" } ).regex( new RegExp( '^[a-zA-Z0-9\\s]+$' ), 'special characters are not allowed!' )
} );

type InputType = z.infer<typeof FormSchema>

function Search ()
{
    const form = useForm<InputType>( {
        resolver: zodResolver( FormSchema ),
        defaultValues: {search: ''}
    } );

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    
    const params = new URLSearchParams( searchParams );

    function onSubmit (  data: InputType )
    {
        if ( data.search ) {
            params.set( 'q', data.search as string );
        } 
        replace(`${pathname}?${params}`)
    }

    function clearInput ()
    {
        replace(pathname)
        form.reset( { search: '' } );
    }
  return (
    <Form {...form}>
          <form
              onSubmit={ form.handleSubmit( onSubmit ) }
              className={ cn( 'flex items-center px-3 py-1 rounded-md sm:rounded-full border bg-inherit mr-auto md:w-[100%] w-full', { 'border-red-400': form.formState.errors.search } ) }
          >
              <SearchIcon strokeWidth={1.5} className='hidden sm:flex text-muted-foreground w-4 h-4' />
              <FormField control={ form.control } name='search' render={ ( { field } ) => (
                  <FormItem className='w-full'>
                      <Input
                          {...field}
                          className='focus-visible:ring-0 shadow-none border-none bg-transparent rounded-none h-7'
                      />
                  </FormItem>
              ) } />
              <div className='flex items-center ml-auto'>
                  { (form.formState.isDirty || form.formState.errors.search) && 
                    <X className='text-muted-foreground w-4 h-4'  onClick={clearInput}/>  
                  }
                  <Button
                  className='text-muted-foreground text-sm h-6'
                  type='submit'
                  size={ 'sm' }
                  variant='ghost'
              >
                  Search
              </Button>
              </div>
        </form>
    </Form>
  )
}

export default Search
