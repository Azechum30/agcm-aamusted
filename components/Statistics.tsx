'use client'

import CardComponent from '@/components/Card'
import { Loader2, LoaderPinwheel, LucideUserPlus2, Sigma, UsersRound } from 'lucide-react'
import { useGetMemberMetrics } from '@/features/dashboard/use-get-member-metrics'
import GenderDoughnutChart from './GenderDoughnutChart'

function Statistics ()
{
    const { data, isLoading} = useGetMemberMetrics()
  
  if ( isLoading ) {
    return <span className='w-full h-full flex justify-center items-center'>
      <Loader2 className='size-6 animate-spin' />
    </span>
  }
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
      <CardComponent
        title='Total Membership'
        description='Total percentage:'
        icon={ <Sigma className='size-8' /> }
        numberCount={data![0]}
        percentage={ ( ( data![ 0 ] / data![ 0 ]! ) * 100 ) }
      /><CardComponent
        title='Males'
        description='Percentage of males:'
        icon={ <LucideUserPlus2 className='size-8' /> }
        numberCount={data![1]}
        percentage={Math.round((data![1] / data![0]!) * 100)}
      />
      <CardComponent
        title='Females'
        description='Percentage of females:'
        icon={ <UsersRound className='size-8' /> }
        numberCount={data![2]}
        percentage={Math.round((data![2] / data![0]!) * 100)}
      />
    </div>
  )
}

export default Statistics
