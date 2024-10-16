'use client'

import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import {Table, TableBody, TableHead, TableRow, TableCell} from './ui/table'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { Loader2 } from 'lucide-react'
import { columnsType } from './columns'
import { Separator } from './ui/separator'
import { QueryResponseType } from '@/app/(dashboard)/members/columns'



type Headers = {
    serialNumber: string,
    firstName: string,
    lastName: string,
    gender: string,
    entryYear: number,
    phoneNumber: string
}

export const columns = [
    {
        header: 'Serial No.',
        accessorKey: 'serialNumber'
    },
    {
        header: 'First Name',
        accessorKey: 'firstName'
    },
    {
        header: 'Last Name',
        accessorKey: 'lastName'
    },
    {
        header: 'Gender',
        accessorKey: 'gender',
        cell: ( { row } ) =>
        {
            const gender = row.getValue( 'gender' ) as string
            const formattedGender = `${gender.charAt(0).toUpperCase()}${gender.slice(1)}`
            return <div>{formattedGender}</div>
        }
    },
    {
        header: 'Contact',
        accessorKey: 'phoneNumber'
    },
    {
        header: 'Year of Enrollment',
        accessorKey: 'entryYear',
    }
] satisfies ColumnDef<Omit<columnsType, 'middleName' | 'department' | 'gender' | 'entryYear'> & { gender:string, entryYear: number } >[]


type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[],
    data: TData[]
}

function DataTable<TData, TValue> ({columns, data }:DataTableProps<TData, TValue>)
{
    const table = useReactTable( {
        data,
        columns,
        getCoreRowModel : getCoreRowModel()
    })
    return (
      <>
        <div className='mt-8 mb-3'>
                <h1 className='text-base font-semibold'>Recently Added Members</h1>
        </div>
        <div className='border'>
            <Table>
                { table.getHeaderGroups().map( headerGroups => (
                    <TableRow key={ headerGroups.id } className='font-bold bg-gray-100'>
                        { headerGroups.headers.map( header => (
                            <TableHead key={ header.id }>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                        ))}
                    </TableRow>
                ) ) }
                <TableBody>
                    { table.getRowModel().rows ? (
                        table.getRowModel().rows.slice(0, 5).map( row => (
                            <TableRow key={ row.id }>
                                { row.getAllCells().map( cell => (
                                    <TableCell key={ cell.id }>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                                </TableRow>
                            ))
                    ): (
                        <TableRow>
                                <TableCell>No rows found!</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    </>
  )
}



function NewlyAddedMembers ()
{
    
    const { data, isLoading } = useGetMembers()

    if ( isLoading ) {
        return <span className='flex justify-center items-center'><Loader2 className='size-6 animate-spin' /></span>
    }
  return (
    <DataTable columns={columns} data={data?.data as any[] } />
  )
}

export default NewlyAddedMembers




