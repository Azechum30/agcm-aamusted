'use client'
import { useGetTithes } from "@/features/tithes/api/use-get-tithes"
import { columns } from "./tithes-column-headers"
import TithesDataTable from "./tithes-data-table"
import { Loader2 } from "lucide-react"
import type { QueryTithesResponse } from "@/features/tithes/api/use-get-tithes"


function RenderTithes ()
{
    const { data, isLoading } = useGetTithes()
    
    if ( isLoading ) {
        return <span className="flex justify-center items-center w-full h-full">
            <Loader2 className="size-6 animate-spin" />
        </span>
    }
  return (
    <TithesDataTable columns={columns} data={data as QueryTithesResponse[] } />
  )
}

export default RenderTithes
