
'use client '

import { useGetMember } from "@/features/members/api/use-get-member";


type Props = {
    memberId: string
}

function ShowPayerName ( { memberId }: Props )
{
    
   const {data} = useGetMember(memberId)
    
  return (
    <div className="capitalize">{data?.firstName} {data?.lastName}</div>
  )
}

export default ShowPayerName
