'use client'

import CardComponent from '@/components/Card'
import { LoaderPinwheel, UsersRound } from 'lucide-react'
import { useGetMemberMetrics } from '@/features/dashboard/use-get-member-metrics'

function Statistics ()
{
    const { data, isLoading} = useGetMemberMetrics()
  
  if ( isLoading ) {
    return <span className='w-full h-screen flex justify-center items-center'>
      <LoaderPinwheel className='size-6 animate-spin' />
    </span>
  }
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
      <CardComponent
        title='Total Membership'
        description='The total number church members'
        icon={ <UsersRound /> }
        numberCount={data![0]}
      /><CardComponent
        title='Males'
        description='The total number of males'
        icon={ <UsersRound /> }
        numberCount={data![1]}
      />
      <CardComponent
        title='Females'
        description='The total number of females'
        icon={ <UsersRound /> }
        numberCount={data![2]}
      />
    </div>
  )
}

export default Statistics
