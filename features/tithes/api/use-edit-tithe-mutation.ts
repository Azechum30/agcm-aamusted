import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from '@/lib/hono'
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";


type ResponseType = InferResponseType<typeof client.api.tithes[':id']['$patch']> 
type RequestType = InferRequestType<typeof client.api.tithes[':id']['$patch']>['json'] 

export const useEditTitheMutation = (id:string) =>
{
    const queryClient = useQueryClient()
    const mutation = useMutation<ResponseType, Error, RequestType>( {
        mutationFn: async (json) =>
        {
            const response = await client.api.tithes[ ':id' ].$patch( { param: { id: id}, json } )
            const data = await response.json()
            if ( !response.ok ) {
                if ( 'error' in data ) {
                    throw new Error(data.error as string)
                } else {
                    throw new Error("An unknown error has occurred!")
                }
            }
            return data
        },
        onSuccess: () =>
        {
            toast.success( "Tithe Record updated successfully!" )
            queryClient.invalidateQueries({queryKey: ['tithe', { id }]})
            queryClient.invalidateQueries({queryKey: ['tithe-list']})
        },
        onError: ( error ) =>
        {
            toast.error(error.message)
        }
    })

    return mutation
}