'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import CountUp from 'react-countup'
type Props = {
    title: string,
    numberCount: number,
    description: string,
    icon: ReactNode
    percentage: number
}

function CardComponent ( { title, numberCount, icon, description, percentage}: Props )
{
  return (
    <Card className='shadow-md bg-gray-100 rounded-t-none'>
          <CardHeader className='bg-white border-b mb-2'>
              <CardTitle className='text-lg font-semibold'>{ title }</CardTitle>
              <div  className='flex justify-between items-center'>
                    <CardDescription className='text-rose-400'>{ description }</CardDescription>
                    <div className='text-xl italic text-rose-400 font-semibold'>{percentage}%</div>
              </div>
          </CardHeader>
          <CardContent>
              <div className='flex justify-between items-center text-sky-400'>
                  { icon }
                  <div>
                      <CountUp end={numberCount} className='text-2xl font-bold italic' />
                  </div>
              </div>
          </CardContent>
    </Card>
  )
}

export default CardComponent
