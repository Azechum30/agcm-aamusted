import { InferResponseType, InferRequestType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono"
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.tithes[ 'bulk-delete' ][ '$post' ],200>
type RequestType = InferRequestType<typeof client.api.tithes[ 'bulk-delete' ][ '$post' ]>[ 'json' ]

export const useBulkDeleteTithes = () =>
{
    const queryClient = useQueryClient()
    const mutation = useMutation<ResponseType, Error, RequestType>( {
        mutationFn: async (json) =>
        {
            const response = await client.api.tithes[ 'bulk-delete' ][ '$post' ]( { json } )
            const data = response.json()
            if ( !response.ok ) {
                if ( 'error' in data ) {
                    throw new Error(data.error as string)
                } else {
                    throw new Error("An unknown error has occurred!")
                }
            }
            return data;
        },
        onSuccess: () =>
        {
            toast.success( "Tithe records were successfully removed!" )
            queryClient.invalidateQueries( { queryKey: [ 'tithe-list' ] } )
            queryClient.invalidateQueries({queryKey: ['totalTitheCount']})
        },
        onError: ( error ) =>
        {
            toast.error(error.message)
        }
    } )
    
    return mutation
}