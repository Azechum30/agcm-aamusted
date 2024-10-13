
import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import Link from 'next/link'

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
                <Link href={ `/members/${row.original.id}` }>
                    <Image
                    src={ row.getValue( 'imageUrl' ) || '/noAvatar.png' }
                    alt='Profile picture'
                    width={ 40 }
                    height={ 40 }
                    className='w-6 h-6 object-cover rounded-full' />
                </Link>
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
] satisfies ColumnDef<QueryResponseType>[]

