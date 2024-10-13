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
        onError: (error) =>
        {
            toast.error(error.message)
        }
    } )
    
    return mutation
}


async function updateMember ( id: string, formdata: RequestType )
{
    const response = await client.api.members[ ':id' ][ '$patch' ]( {
        param: { id: id },
        form: { ...formdata }
    } );

    const data = await response.json()
    

    if ( !response.ok ) {
        if ( 'error' in data ) {
            throw new Error(data.error as string)
        } else {
            
            throw new Error('An unknown error has occurred!')
        }
    }

    return data
}