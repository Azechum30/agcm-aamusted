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
            const data = await response.json()

            if ( !response.ok ) {
                if ( "error" in data ) {
                    throw new Error(data.error as string)
                } else {
                    throw new Error("An unknown error has occurred!")
                }
            }
            return data
        },

        onSuccess: (data) =>
        {
            toast.success( 'Tithe record added successfully!' )
            queryClient.invalidateQueries( { queryKey: [ 'tithe-list' ] } )
            queryClient.setQueryData( [ 'tithe-list' ], ( oldData: any ) =>
            {
                if ( Array.isArray( oldData ) ) {
                    [...oldData, data]
                } else if ( oldData && Array.isArray( oldData.data ) ) {
                    return {...oldData, data: [...oldData.data, data]}
                } else {
                    return [data]
                }
            })
        },
        onError: (error: Error) =>
        {
            toast.error(error.message)
        },
    } )
    
    return mutation
}
