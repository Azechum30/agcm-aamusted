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
            const { data } = await response.json()
            
            if(!response.ok){
                if ( 'error' in data! ) {
                    toast.error(data.error as string)
                }
                else {
                    toast.error("An unknown error has occurred!")
                }
            }
            return data
        },
        enabled: !!id,
    } )
    
    return query
}
