import CardComponent from '@/components/Card'
import { UsersRound } from 'lucide-react'
import {getTotalMembership, males, females} from '@/lib/actions/server-only-actions'

async function StatisticsPage ()
{ 
  let values:any = []
  const results = await Promise.allSettled( [ getTotalMembership(), males(), females() ] )

  results.forEach( result =>
  { 
    if ( result.status === 'fulfilled' ) {
      values.push(result.value)
    }
   })

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
      <CardComponent
        title='Total Membership'
        description='The total number church members'
        icon={ <UsersRound /> }
        numberCount={values[0]}
      /><CardComponent
        title='Males'
        description='The total number of males'
        icon={ <UsersRound /> }
        numberCount={values[1]}
      />
      <CardComponent
        title='Females'
        description='The total number of females'
        icon={ <UsersRound /> }
        numberCount={values[2]}
      />
    </div>
  )
}

export default StatisticsPage
