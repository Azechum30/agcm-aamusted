'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import CountUp from 'react-countup'
type Props = {
    title: string,
    numberCount: number,
    description: string,
    icon: ReactNode
}

function CardComponent ( { title, numberCount, icon, description }: Props )
{
  return (
    <Card className='shadow-md bg-gray-100'>
          <CardHeader>
              <CardTitle className='text-xl font-semibold'>{ title }</CardTitle>
              <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
              <div className='flex justify-between items-center text-blue-500'>
                  { icon }
                  <div className='text-2xl font-bold italic'>
                      <CountUp end={numberCount} />
                  </div>
              </div>
          </CardContent>
    </Card>
  )
}

export default CardComponent
