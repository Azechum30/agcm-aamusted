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
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import ExportAsPDF from '@/lib/export-as-pdf'


function MembersPage() {

  const [ pageIndex, setPageIndex ] = useState( 0 );
  const [pageSize, setPageSize] = useState(10)
  const { data, isLoading } = useGetMembers(true, pageIndex + 1, pageSize)
  const { mutate, isPending } = useBulkDeleteMembers()
  const isAdmin = useUser().user?.organizationMemberships?.[0]?.role === 'org:admin'
  
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

  const newData = data?.data.map( row =>
  {
    const { middleName,imageUrl, hostel, hometown, email, id, dateOfBirth, ...rest } = row
    return rest
  } );
  
  return (
    <Card className='drop-shadow-md border-none rounded-none max-w-6xl w-full mx-auto -mt-4'>
      <CardHeader className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-3 bg-gray-100/85 mb-4 border-b sm:sticky sm:top-0 lg:left-0 sm:h-16 text-center sm:text-left'>
        <CardTitle className='text-xl capitalize line-clamp-1'>All Members</CardTitle>
        {
          isAdmin && (
            <>
              <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                <OpenCreateForm />
                <ExportAsPDF
                  title='List of AGCM Members'
                  filename='members'
                  data={newData as any[]}
                />
              </div>
            </>
          )
        }
      </CardHeader>
      <CardContent className='w-full'>
          <MembersDataTable
            columns={columns}
            data={ data?.data as QueryResponseType[] }
            pageIndex={ pageIndex }
            pageSize={ pageSize }
            setPageIndex={ setPageIndex }
            setPageSize={ setPageSize }
            pageCount={Math.ceil(data?.pageCount! / pageSize)}
            disabled={ isPending }
            onDelete={ ( row ) =>
            {
              const ids = row.map( r => r.original.id );
              mutate({ids})
            }}
          />
      </CardContent>
    </Card>
  )
}

export default MembersPage