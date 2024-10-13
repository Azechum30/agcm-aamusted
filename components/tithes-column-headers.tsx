
import { ColumnDef } from '@tanstack/react-table'
import TitheActions from './TitheActions'
import { InferResponseType } from 'hono'
import {client} from '@/lib/hono'
import { Checkbox } from './ui/checkbox'


type Response = InferResponseType<typeof client.api.tithes.$get>[ 'data' ][ 0 ]


export const columns = [
    {
        header: ({table}) =>
        {
            return (
                <Checkbox
                    checked={ table.getIsAllPageRowsSelected() }
                    onCheckedChange={ () => table.toggleAllPageRowsSelected() }
                    className="rounded-full"
                />
            )
        },
        id: "select",
        cell: ( { row } ) =>
        {
            return (
                <Checkbox
                    checked={ row.getIsSelected() }
                    onCheckedChange={ ( val ) => row.toggleSelected( !!val ) }
                    className='rounded-full'
                />
            )
        },
        enableHiding: false,
        enableSorting: false
    },
    
    {
        header: 'Amount',
        accessorKey: 'amount'
    },
    {
        header: 'Payment Date',
        accessorKey: 'paymentDate',
    },
    {
        header: 'Payment Method',
        accessorKey: 'paymentMethod'
    },
    {
        header: "Payee's Name",
        accessorKey: 'memberId',
    },
    {
        header: 'Actions',
        id: 'actions',
        cell: ( { row } ) =>
        {
            return <TitheActions id={row.original.id} />
        }
    }
] satisfies ColumnDef<Response>[]