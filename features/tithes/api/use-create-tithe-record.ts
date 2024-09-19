import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { client } from '@/lib/hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<typeof client.api.tithes.$post>
type RequestType = InferRequestType<typeof client.api.tithes.$post>[ 'json' ]



export const useCreateTitheRecord = () =>
{
    const queryClient = useQueryClient()
    const mutation = useMutation<ResponseType, Error, RequestType>( {
        mutationFn: async ( json ) =>
        {
            const response = await client.api.tithes.$post( { json } )
            return await response.json()
        },

        onSuccess: () =>
        {
            toast.success( 'Tithe record added successfully!' )
            queryClient.invalidateQueries({queryKey: ['tithe-list']})
        },
        onError: (error) =>
        {
            toast.error(error.message)
        },
    } )
    
    return mutation
}
