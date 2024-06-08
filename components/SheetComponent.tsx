
'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader } from "./ui/sheet"
import { useOpenSheet } from "@/app/hooks/use-open-sheet"
import { useCSVReader } from 'react-papaparse'
import { Button } from "./ui/button"
import {useMemo,  useState} from 'react'
import { Save, X } from "lucide-react"
import DataTable from "./data-table"
import { useBulkCreateMembers } from "@/features/members/api/use-bulk-create-members"
import { cn } from "@/lib/utils"

export default function SheetComponent ()
{
  const { isOpen, onClose } = useOpenSheet()
  const { CSVReader } = useCSVReader()

  const [columnData, setColumnData] = useState( [] );
  const [tData, setTData] = useState( [] );

  const columns = useMemo( () => columnData, [ columnData ] );
  const data = useMemo( () => tData, [ tData ] );

  const { mutate,  isPending } = useBulkCreateMembers()


  const handleFileUpload = (data:any)=>
  {
    console.log(data)
    const headers = data?.data[ 0 ].map( ( header: string ) => ( {
      header,
      accessorKey: header,
    }))

    
    const dataSet = data?.data.slice( 1, data?.data.length - 1 ).map( ( row: any ) =>
      row.reduce( ( acc: any, curr: any, index: number ) =>
      {
        acc[ headers[ index ].accessorKey ] = curr;
        return acc
      }, {})
    )
    
    setColumnData( headers );
    setTData(dataSet)
  }

  const handleUploadError = (err:any) =>
  {
    console.log(err) 
  }

  const handleDataSubmission = () =>
  {
    mutate( data, {
      onSuccess: () =>
      {
        setColumnData( [] )
        setTData([])
        onClose()
      }
    })
  }
  return (
      <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent side={'left'} className={cn('w-full h-screen overflow-y-auto border-none', data?.length > 0 && 'lg:max-w-7xl')}>
            
                 <SheetHeader className='font-bold text-xl '>Upload Members Data</SheetHeader>
                <SheetDescription>
                  Kindly click on the upload button to select a file to upload
                </SheetDescription>
                <CSVReader
                  onUploadAccepted={ handleFileUpload}
                  onError={handleUploadError}
                >
                  {
                    ( { getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }: any ) => ( 
                    
                      <>
                        <div className="flex mb-2 mt-6 border rounded-md max-w-sm">
                          <Button { ...getRootProps() } className="w-[30%] rounded-none">Browse File</Button> 
                          <div className='w-[70%] h-[45] leading-loose pl-2 flex items-center'>
                            {acceptedFile && acceptedFile.name}
                          </div>
                          {
                            acceptedFile && (
                              <Button variant={'ghost'} {...getRemoveFileProps()}>
                                  <X className='size-4 text-red-500 font-bold ' />
                              </Button>
                            )
                          }
                        </div>
                        <div className="max-w-sm mb-10">
                          <ProgressBar />
                      </div>
                      </>
                  )}     
                </CSVReader>
                { data?.length > 0 && <>
                <div className='mb-2 '>
                  <Button variant={'secondary'} onClick={handleDataSubmission} disabled={isPending}> 
                    <Save className='size-4 mr-1' />
                    Save to Database
                </Button>
                </div>
                <DataTable columns={columns} data={data} />
                </> }
             
          </SheetContent>
    </Sheet>
  )
}
