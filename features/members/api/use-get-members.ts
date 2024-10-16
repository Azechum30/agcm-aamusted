import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { useSearchParams } from 'next/navigation';


export function useGetMembers (paginate?: boolean, page?:number, pageSize?:number)
{
    const searchParams = useSearchParams()
    const q = searchParams.get( 'q' )
    
    const query = useQuery( {
        queryKey: [ 'members', {q, page, pageSize} ], 
        queryFn: async () => await fetchUsers(paginate as boolean, page as number, pageSize as number, q as string, ), 
        enabled: true,
        placeholderData: keepPreviousData
    } )
    return query
}



async function fetchUsers ( paginate?:boolean, page?:number, pageSize?:number, q?: string)
{
    let response

    if ( q ) {
        response = await client.api.members.$get( { query: { q, page, pageSize, paginate } } );
    } else {
        response = await client.api.members.$get( { query: { page, pageSize, paginate } } )
    }
    

    const data = await response.json();

    if ( !response.ok ) {
        if ( 'error' in data ) {
            throw new Error(data.error as string)
        } else {
            
         throw new Error("an unknown error has occurred!")
        }
    }

    

    return data
}