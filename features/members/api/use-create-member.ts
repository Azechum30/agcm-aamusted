import { useMutation, useQueryClient } from "@tanstack/react-query";
import {InferResponseType, InferRequestType} from 'hono'
import { client } from "@/lib/hono";
import { toast } from "sonner";


type ReponseType = InferResponseType<typeof client.api.members.$post>
type RequestType = InferRequestType<typeof client.api.members.$post>['form']

export const useCreateMember= () =>{
    const queryClient = useQueryClient()
    const mutation = useMutation<ReponseType, Error, RequestType>( {
        mutationFn: async (form) =>
        {
            const response = await client.api.members.$post( { form } );
            const data = await response.json()
            if ( !response.ok ) {
                if ( 'error' in data ) {
                    throw new Error(data.error as string)
                } else {
                    throw new Error("an unknown error occurred!")
                }
            }

            return data;
        },
        onSuccess: () =>
        {
            toast.success("member created!")
            queryClient.invalidateQueries({queryKey: ['members']})
            queryClient.invalidateQueries({queryKey: ['totalMemberCount']})
        },

        onError: (error) =>
        {
            toast.error(error.message)
        }
    } )
    return mutation
}