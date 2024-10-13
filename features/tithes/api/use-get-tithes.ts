import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { toast } from 'sonner'
import { InferResponseType } from 'hono'
import { useSearchParams } from 'next/navigation'


export type QueryTithesResponse = InferResponseType<typeof client.api.tithes.$get>['data'][0]


export const useGetTithes = (page:number, pageSize:number) =>
{
    const searchParams = useSearchParams()
    const q = searchParams.get( 'q' )
    
    const query = useQuery( {
        queryKey: [ 'tithe-list', { q, page, pageSize } ],
        queryFn: async () => await getTithes( page, pageSize, q! ),
        placeholderData: keepPreviousData
    } )
    
    return query
}


async function getTithes (page:number, pageSize:number, q?:string)
{
    let response
    if ( q ) {
        response = await client.api.tithes.$get({query: { q, page, pageSize }})
    } else {
        response = await client.api.tithes.$get({query: {page, pageSize }})
    }
    
    const { data, totalRecords } = await response.json()
    if ( !response.ok ) {
        if ( 'error' in data ) {
            toast.error(data.error as string)
        } else {
            toast.error("An unknown error has occurred!")
        }
    }
    return {data, totalRecords}
}