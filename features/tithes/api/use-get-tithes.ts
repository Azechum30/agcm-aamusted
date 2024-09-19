import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { toast } from 'sonner'
import { InferResponseType } from 'hono'



export type QueryTithesResponse = InferResponseType<typeof client.api.tithes.$get>['data'][0]


export const useGetTithes = () =>
{
    const query = useQuery( {
        queryKey: [ 'tithe-list' ],
        queryFn: async()=> await getTithes()
    } )
    
    return query
}


async function getTithes ()
{
    const response = await client.api.tithes.$get()
    if ( !response.ok ) {
        toast.error('Something went wrong!')
    }

    const {data} = await response.json()
    return data
}