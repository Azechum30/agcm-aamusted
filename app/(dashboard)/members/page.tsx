'use client'

import React, { Suspense } from 'react'
import MembersDataTable from './data-table'
import { Loader2, MoreHorizontal } from 'lucide-react'
import OpenCreateForm from '@/components/OpenCreateForm'
import {Card, CardHeader, CardContent, CardTitle} from '@/components/ui/card'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useBulkDeleteMembers } from '@/features/members/api/use-bulk-delete-members-'
import { columns, QueryResponseType } from './columns'
import { Skeleton } from '@/components/ui/skeleton'

function MembersPage() {

  const { data, isLoading } = useGetMembers()
  const { mutate, isPending } = useBulkDeleteMembers()

  
  if ( isLoading ) {
    return (
      <Card className='drop-shadow-md border-none rounded-none max-w-6xl w-full mx-auto -mt-4'>
        <CardHeader className='sm:flex-row sm:justify-between sm:items-center gap-y-4 bg-gray-100/85 mb-4 border-b'>
          <Skeleton />
        </CardHeader>
        <CardContent className='w-full flex justify-center items-center h-screen'>
          Loading data
          <Loader2 className='size-6 text-muted-foreground animate-spin ml-2' />
        </CardContent>
    </Card>
    )
  }

  return (
    <Card className='drop-shadow-md border-none rounded-none max-w-6xl w-full mx-auto -mt-4'>
      <CardHeader className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-3 bg-gray-100/85 mb-4 border-b sm:sticky sm:top-0 lg:left-0 sm:h-16 text-center sm:text-left'>
        <CardTitle className='text-xl capitalize line-clamp-1'>List of Members</CardTitle>
        <OpenCreateForm />
      </CardHeader>
      <CardContent className='w-full'>
        <Suspense fallback={<span className='flex items-center gap-1'>Loading <MoreHorizontal className='animate-ping' /></span>}>
          <MembersDataTable
            columns={columns}
            data={ data as QueryResponseType[] }
            disabled={ isPending }
            onDelete={ ( row ) =>
            {
              const ids = row.map( r => r.original.id );
              mutate({ids})
            }}
          />
      </Suspense>
      </CardContent>
    </Card>
  )
}

export default MembersPage