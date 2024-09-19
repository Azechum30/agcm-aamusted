
import { ColumnDef } from '@tanstack/react-table'
import type { TitheType } from '@/app/types/types' 
import ShowPayerName from './ShowPayerName'
import TitheActions from './TitheActions'
import { InferResponseType } from 'hono'
import {client} from '@/lib/hono'


type Response = InferResponseType<typeof client.api.tithes.$get>['data'][0]

export const columns = [
    
    {
        header: 'Amount',
        accessorKey: 'amount'
    },
    {
        header: 'Payment Date',
        accessorKey: 'paymentDate',
        cell: ( { row } ) =>
        {
            const formattedDate = new Date( row.getValue( 'paymentDate' ) as string ).toLocaleDateString()
            return <div>{formattedDate}</div>
        }
    },
    {
        header: 'Payment Method',
        accessorKey: 'paymentMethod'
    },
    {
        header: "Payee's Name",
        accessorKey: 'memberId',
        cell: ( { row } ) =>
        {
            const id = row.original.memberId
            
            return <ShowPayerName memberId={id} />
        }
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