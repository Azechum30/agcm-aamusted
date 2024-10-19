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
import { useCallback, useEffect } from 'react';



const FormSchema = z.object( {
    search: z.string( { required_error: "search a term is required!" } )
} );

type InputType = z.infer<typeof FormSchema>

function Search ()
{
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const form = useForm<InputType>( {
        resolver: zodResolver( FormSchema ),
        defaultValues: {search: searchParams.get('q') || ''}
    } );

    

    const onSubmit = useCallback( (data:InputType) =>
    {
        const params = new URLSearchParams( searchParams );
        if ( data.search ) {
            params.set( 'q', data.search );
        } 
        replace(`${pathname}?${params.toString()}`)
    }, [searchParams, pathname, replace])

    const clearInput = useCallback( () =>
    {
        form.reset( { search: '' } );
        const params = new URLSearchParams( searchParams );
        params.delete( 'q' );
        replace(`${pathname}?${params.toString()}`)
    }, [ form, searchParams, pathname, replace ] )
    
   
  return (
    <Form {...form}>
          <form
              onSubmit={ ( e ) => { e.preventDefault(); form.handleSubmit( onSubmit )()}  }
              className={ cn( 'flex flex-row-reverse sm:flex-row items-center  px-3 py-1 rounded-md sm:rounded-full border bg-inherit md:w-auto w-full', { 'border-red-400': form.formState.errors.search } ) }
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
