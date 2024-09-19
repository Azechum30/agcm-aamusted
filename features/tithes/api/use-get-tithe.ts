import { useQuery } from "@tanstack/react-query";
import { client } from '@/lib/hono'
import { toast } from "sonner";


export const useGetTithe = (id:string) =>
{
    const query = useQuery( {
        queryKey: [ 'tithe', { id } ],
        queryFn: async () =>
        {
            const response = await client.api.tithes[ ':id' ].$get( { param: { id: id } } );
            if ( !response.ok ) {
                toast.error("Something went wrong!")
            }
            const {data} = await response.json()
            return data
        },
        enabled: !!id
    } )
    
    return query
}
