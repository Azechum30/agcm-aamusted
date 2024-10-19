'use client'
import { useGetTithes } from "@/features/tithes/api/use-get-tithes"
import { columns } from "./tithes-column-headers"
import TithesDataTable from "./tithes-data-table"
import { Loader2 } from "lucide-react"
import type { QueryTithesResponse } from "@/features/tithes/api/use-get-tithes"
import { useBulkDeleteTithes } from "@/features/tithes/api/use-bulk-delete-tithes"
import React, { useState } from "react"
import OpenTitheForm from "./OpenTitheForm"
import ExportAsPDF from "@/lib/export-as-pdf"
import { useUser } from "@clerk/nextjs"


function RenderTithes ()
{

  const [ pageIndex, setPageIndex ] = useState( 0 )
  const [ pageSize, setPageSize ] = useState( 10 )
  

  const { data, isLoading } = useGetTithes(pageIndex + 1, pageSize)
  const { isPending, mutate } = useBulkDeleteTithes()
  const isAdmin = useUser().user?.organizationMemberships?.[0]?.role === 'org:admin'
    
    if ( isLoading ) {
        return <span className="flex justify-center items-center w-full h-screen">
           Loading data <Loader2 className="size-6 animate-spin ml-1" />
        </span>
    }

  const exportData = data?.data.map( row =>
  {
    const { id, ...rest } = row;
    return rest
  })
  return (
    <React.Fragment>
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <h1 className="text-lg text-center md:text-left font-semibold line-clamp-1 md:mr-auto">All Tithes</h1>
        {
          isAdmin && (
            <React.Fragment>
              <div>
                <OpenTitheForm />
              </div>
              <div>
                <ExportAsPDF
                    title="List of Tithes"
                    filename="tithes"
                    data={exportData as any[]}
                />
              </div>
            </React.Fragment>
          )
        }
      </div>
        <TithesDataTable
            columns={ columns }
            data={ data?.data as QueryTithesResponse[] }
            pageIndex={ pageIndex }
            pageSize={ pageSize }
            setPageSize={ setPageSize }
            setPageIndex={setPageIndex}
            pageCount= {Math.ceil(data?.totalRecords as number / pageSize)}
            disabled={ isPending }
            onDelete={ ( row ) =>
            {
              const ids = row.map( r => r.original.id )
              mutate({ids})
            } }
        />
    </React.Fragment>
  )
}

export default RenderTithes
