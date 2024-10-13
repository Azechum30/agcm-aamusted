'use client'
import { useGetTithes } from "@/features/tithes/api/use-get-tithes"
import { columns } from "./tithes-column-headers"
import TithesDataTable from "./tithes-data-table"
import { Loader2 } from "lucide-react"
import type { QueryTithesResponse } from "@/features/tithes/api/use-get-tithes"
import { useBulkDeleteTithes } from "@/features/tithes/api/use-bulk-delete-tithes"
import { useState } from "react"


function RenderTithes ()
{

  const [ pageIndex, setPageIndex ] = useState( 0 )
  const [ pageSize, setPageSize ] = useState( 10 )
  

  const { data, isLoading } = useGetTithes(pageIndex + 1, pageSize)
  const {isPending, mutate} = useBulkDeleteTithes()
    
    if ( isLoading ) {
        return <span className="flex justify-center items-center w-full h-screen">
            <Loader2 className="size-6 animate-spin" />
        </span>
    }
  return (
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
  )
}

export default RenderTithes
