import { InferResponseType, InferRequestType } from 'hono'
import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner';


type ResponseType = InferResponseType<typeof client.api.members[ 'bulk-delete' ][ '$post' ], 200>
type RequestType = InferRequestType<typeof client.api.members['bulk-delete']['$post']>['json']

export const useBulkDeleteMembers = () =>
{
    const queryClient = useQueryClient()
    const mutation = useMutation<ResponseType, Error, RequestType>( {
        mutationFn: async (json) =>
        {
            const response = await client.api.members[ 'bulk-delete' ][ '$post' ]( { json } );
            return await response.json()
        },

        onSuccess: () =>
        {
            toast.success("members deleted successfully")
            queryClient.invalidateQueries( { queryKey: [ 'members' ] } )
            queryClient.invalidateQueries( { queryKey: [ 'totalMemberCount' ] } )
            
        },

        onError: () =>
        {
            toast.error("Something went wrong!")
        }
    } )
    return mutation
}
