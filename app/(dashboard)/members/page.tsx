'use client'

import React, { Suspense } from 'react'
import MembersDataTable from './data-table'
import { ArrowBigDown, File, Loader2, MoreHorizontal } from 'lucide-react'
import OpenCreateForm from '@/components/OpenCreateForm'
import {Card, CardHeader, CardContent, CardTitle} from '@/components/ui/card'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useBulkDeleteMembers } from '@/features/members/api/use-bulk-delete-members-'
import { columns, QueryResponseType } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Button } from '@/components/ui/button'
import { headers } from '@/components/headers'


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

  function exportPDF ()
  {
  
    const doc = new jsPDF( { orientation: 'landscape' } )
    doc.setFontSize(16)
    
    const title = 'List of AGCM-AAMUSTED Members'

    const tableDat = data?.map( (row) =>
    {
      const formattedDate = new Date( row.dateOfBirth ).toLocaleDateString()
      const formattedGender = `${row.gender.charAt(0).toUpperCase()}${row.gender.slice(1)}`
      row.dateOfBirth = formattedDate
      row.gender = formattedGender
      return row
    })

    const header = headers.map( col =>col.header )
    const tableData = tableDat?.map( (row) => headers.map( col => row[ col.accessorKey! ] ) )
    doc.text("LIST OF AGCM, AAMUSTED-KUMASI STUDENTS", 15, 10)
    autoTable( doc, { head: [header], body: tableData, startY: 20, theme:'grid' } )
    doc.save('table.pdf')
  }

  return (
    <Card className='drop-shadow-md border-none rounded-none max-w-6xl w-full mx-auto -mt-4'>
      <CardHeader className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-3 bg-gray-100/85 mb-4 border-b sm:sticky sm:top-0 lg:left-0 sm:h-16 text-center sm:text-left'>
        <CardTitle className='text-xl capitalize line-clamp-1'>List of Members</CardTitle>
        <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
          <OpenCreateForm />
          <Button disabled={data?.length === 0} variant='destructive' size={ 'sm' } onClick={ exportPDF }>
            <ArrowBigDown className='size-6 mr-1' />
            View as PDF
          </Button>
        </div>
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