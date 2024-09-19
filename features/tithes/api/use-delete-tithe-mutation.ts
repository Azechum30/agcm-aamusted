import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<typeof client.api.tithes[ ':id' ][ '$delete' ]>
type RequestType = InferRequestType<typeof client.api.tithes[ ':id' ][ '$delete' ]>[ 'param' ]


export const useDeleteTitheMutation = (id?:string) =>
{
    const queryClient = useQueryClient()
    const mutation = useMutation<ResponseType, Error, RequestType>( {
        mutationFn: async (param) =>
        {
            const response = await client.api.tithes[ ':id' ].$delete( { param } )
            return await response.json()
        },
        onSuccess: () =>
        {
            toast.success( "Tithe record was deleted successfully!" )
            queryClient.invalidateQueries( { queryKey: [ 'tithe', { id } ] } )
            queryClient.invalidateQueries({queryKey: ['tithe-list']})
        },
        onError: (error) =>
        {
            toast.error(error.message)
        }
    } )
    
    return mutation
}