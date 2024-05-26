import { InferResponseType, InferRequestType } from "hono";
import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.members[ ':id' ][ '$patch' ]>
type RequestType = InferRequestType<typeof client.api.members[ ':id' ][ '$patch' ]>['form']




export const useEditMember = (id?:string) =>
{
    const queryClient = useQueryClient()
    const mutation = useMutation<ResponseType, Error, RequestType>( {
        mutationFn: async ( form ) => await updateMember( id!, form ),
        onSuccess: () =>
        {
            toast.success("Member updated successfully")
            queryClient.invalidateQueries({queryKey: ['member', { id }]})
            queryClient.invalidateQueries({queryKey: ['members']})
        },
        onError: () =>
        {
            toast.error("Failed to update member")
        }
    } )
    
    return mutation
}


async function updateMember ( id: string, data: RequestType )
{
    const response = await client.api.members[ ':id' ][ '$patch' ]( {
        param: { id: id },
        form: { ...data }
    } );

    if ( !response.ok ) {
        toast.error(`Something went wrong!: ${response.statusText}`)
        throw new Error(`Something went wrong!: ${response.statusText}`)
    }

    return await response.json()
}