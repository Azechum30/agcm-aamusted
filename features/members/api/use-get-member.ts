import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono';



export const useGetMember = (id?:string) =>
{
    const query = useQuery( {
        queryKey: [ 'member', { id } ],
        queryFn: async () => await fetchMember( id as string ),
        enabled: !!id,
    } )

    return query
}


async function fetchMember (id?:string){
    const response = await client.api.members[ ':id' ].$get( { param: { id: id! } } );
    const { data } = await response.json();

    if ( !response.ok ) {
        if ( 'error' in data ) {
            throw new Error(data.error as string)
        } else {
            
            throw new Error('An unknown error has occurred!')
        }
    }

    return data

}