import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono';



export const useGetMember = (id?:string) =>
{
    const query = useQuery( {
        queryKey: [ 'member', { id } ],
        queryFn: async () => await fetchMember( id as string ),
        enabled: !!id
    } )
    return query
}


async function fetchMember (id?:string){
    const response = await client.api.members[ ':id' ].$get( { param: { id: id } } );
    if ( !response.ok ) {
        throw new Error(`Failed to fetch member: ${response.statusText}`)
    }
    const { data } = await response.json();

    return data

}