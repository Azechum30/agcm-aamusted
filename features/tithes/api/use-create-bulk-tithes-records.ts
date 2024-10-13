import { InferResponseType, InferRequestType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from '@/lib/hono'
import { toast } from "sonner";


type ResponseType = InferResponseType<typeof client.api.tithes[ 'bulk-create' ][ '$post' ]>
type RequestType = InferRequestType<typeof client.api.tithes[ 'bulk-create' ][ '$post' ]>[ 'json' ]


export const useBulkCreateTithesRecords = () =>
{
    const queryClient = useQueryClient()
    const mutation = useMutation<ResponseType, Error, RequestType>( {
        mutationFn: async (json) =>
        {
            const response = await client.api.tithes[ 'bulk-create' ][ '$post' ]( { json } )
            const data = await response.json()

            if ( !response.ok ) {
                if ( 'error' in data ) {
                    throw new Error(data.error as string)
                } else {
                    throw new Error("An unknown error has occurred!")
                }
            }

            return data;
        },

        onSuccess: ( data ) =>
        {
            if ( data.data > 0 ) {
                toast.success( `${ data.data } records were uploaded successfully!` )
            } else {
                toast.success('All records in the file are already uploaded!')
            }
            queryClient.invalidateQueries( { queryKey: [ 'tithe-list' ] } )
            
        },

        onError: ( error ) =>
        {
            toast.error(error.message)
        }
    } )
    
    return mutation
}