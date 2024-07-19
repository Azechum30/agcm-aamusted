import { InferResponseType, InferRequestType } from 'hono'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.members[ ':id' ][ '$delete' ]>
type RequestType = InferRequestType<typeof client.api.members[ ':id' ][ '$delete' ]>[ 'param' ];


export const useDeleteMember = (id?: string) =>
{
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>( {
        mutationFn: async (param) => await deleteMember( param.id ),
        onSuccess: () =>
        {
            toast.success( 'Member deleted successfully' );
            queryClient.invalidateQueries( { queryKey: [ 'member', { id } ] } )
            queryClient.invalidateQueries({queryKey: ['members']})
            queryClient.invalidateQueries({queryKey: ['totalMemberCount']})
        },
        onError: () =>
        {
            toast.error("Failed to delete member!")
        }
    } )
    
    return mutation
}



async function deleteMember ( id?: string )
{
    const response = await client.api.members[ ':id' ].$delete( { param: { id: id } } );
    if ( !response.ok ) {
        throw new Error(`An error occurred! ${response.statusText}`)
    }

    return await response.json()
}