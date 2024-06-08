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
        
        onSuccess: () =>
        {
            toast.success( "members uploaded successfully" )
            queryClient.invalidateQueries({queryKey: ['members']})
        },

        onError: () =>
        {
            toast.error("Something went wrong!")
        }
    })

    return mutation
    
}



async function createMembers ( json: RequestType )
{
    const response = await client.api.members[ 'bulk-create' ][ '$post' ]( { json: { json }} );

    if ( !response.ok ) {
        throw new Error('Failed to upload members')
    }

    return await response.json()
}