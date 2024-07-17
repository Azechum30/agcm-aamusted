import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { InferResponseType, InferRequestType } from 'hono'


export const useGetMemberMetrics = () =>
{
    const query = useQuery( {
        queryKey: [ 'dashboard' ],
        queryFn: async () => await getMetrics()
    } )
    
    return query
}

async function getMetrics ()
{
    const response = await client.api.$get()

    const {data} = await response.json()
    return data
}