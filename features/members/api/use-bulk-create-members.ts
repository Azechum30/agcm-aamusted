import { InferResponseType, InferRequestType } from 'hono'
import { client } from '@/lib/hono';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.members[ 'bulk-create' ][ '$post' ], 201>
type RequestType = InferRequestType<typeof client.api.members['bulk-create']['$post']>['json']['json']




export const useBulkCreateMembers = () =>
{
    const queryClient = useQueryClient()
    const mutation = useMutation<ResponseType, Error, RequestType>( {
        mutationFn: async ( json ) => await createMembers( json ),
        
        onSuccess: ({data}) =>
        {
            toast.success(`${data.count} members were added successfully`)
            queryClient.invalidateQueries({queryKey: ['members']})
            queryClient.invalidateQueries({queryKey: ['totalMemberCount']})
        },

        onError: (error) =>
        {
            toast.error(error.message)
        }
    })

    return mutation
    
}



async function createMembers ( json: RequestType )
{
    const response = await client.api.members[ 'bulk-create' ][ '$post' ]( { json: { json } } );
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