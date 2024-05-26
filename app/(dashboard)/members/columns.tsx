import { MemberSchema } from '@/app/types/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import Image from 'next/image'

import { InferResponseType } from 'hono'
import {client} from '@/lib/hono'
import Actions from '@/components/Actions'


export type QueryResponseType = InferResponseType<typeof client.api.members.$get>['data'][0]

export const columns = [
    {
        header: ({table}) =>
        {
            return (
                <Checkbox
                    checked={ table.getIsAllPageRowsSelected() }
                    onCheckedChange={ () => table.toggleAllPageRowsSelected() }
                    className='rounded-full'
                />
            )
        },
        id: 'select',
        cell: ( { row } ) =>
        {
            return (
                <Checkbox
                    checked={ row.getIsSelected() }
                    onCheckedChange={val=>row.toggleSelected(!!val)}
                    className='rounded-full'
                />
            )
        },
        enableHiding: false,
        enableSorting: false,
        
    },
    {
        header: 'Avatar',
        accessorKey: 'imageUrl',
        cell: ( { row } ) =>
        {
            return (
                <Image
                    src={ row.getValue( 'imageUrl' ) || '/noAvatar.png' }
                    alt='Profile picture'
                    width={ 40 }
                    height={ 40 }
                    className='w-6 h-6 object-cover rounded-full' />
            )
        }
    },
    {
        header: 'Serial No.',
        accessorKey: 'serialNumber'
    },
    {
        header: 'FirstName',
        accessorKey: 'firstName'
    },
    {
        header: 'LastName',
        accessorKey: 'lastName'
    },
    {
        header: 'DateOfBirth',
        accessorKey: 'dateOfBirth',
        cell: ( { row } ) =>
        {
            const formattedDate = new Date( row.getValue( 'dateOfBirth' ) ).toLocaleDateString();
            return <div>{formattedDate}</div>
        }
    },
    {
        header: 'Gender',
        accessorKey: 'gender'
    },
    {
        header: 'Contact',
        accessorKey: 'phoneNumber',
    },
    // {
    //     header: ( { column } ) =>
    //     {
    //         return (
    //             <Button
    //                 variant='ghost'
    //                 onClick={()=>column.toggleSorting(column.getIsSorted() === 'asc')}
    //             >
    //                 EntryYear <ArrowUpDown className='w-4 h-4 ml-1' /> 
    //             </Button>
    //         )
            
    //     },
    //     accessorKey: 'entryYear',
    // },
    {
        header: 'Department',
        accessorKey: 'department'
    },
    {
        header: 'Email',
        accessorKey: 'email'
    },
    {
        id: 'actions',
        cell: ( { row } ) =>
        {
            return <Actions id={row.original.id} />
        }
    },
    // {
    //     header: 'Hostel',
    //     accessorKey: 'hostel'
    // },
    // {
    //     header: 'Programme',
    //     accessorKey: 'course'
    // }
] satisfies ColumnDef<QueryResponseType>[]

