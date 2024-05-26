import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { useSearchParams } from 'next/navigation';
import { InferResponseType } from 'hono';


export function useGetMembers ()
{
    const searchParams = useSearchParams()
    const q = searchParams.get( 'q' )
    
    const query = useQuery( {
        queryKey: [ 'members', q ], 
        queryFn: async () => await fetchUsers( q as string ), 
        enabled: true
    } )
    return query
}



async function fetchUsers (q?: string)
{
    let response

    if ( q ) {
        response = await client.api.members.$get( { query: { q: q } } );
    } else {
        response = await client.api.members.$get()
    }
    

    if ( !response.ok ) {
        throw new Error(`Failed to fetch users: ${response.statusText}`)
    }

    const { data } = await response.json();
    return data
}