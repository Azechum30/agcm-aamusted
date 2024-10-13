'use client'
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetDescription, SheetTitle } from "./ui/sheet"
import { useOpenSheet } from "@/app/hooks/use-open-sheet"
import { useCSVReader } from "react-papaparse"
import { Button } from "./ui/button"
import { Loader2, Save, Upload, X } from "lucide-react"
import { useMemo, useState } from "react"
import DataTable from "./data-table"
import { useBulkCreateTithesRecords } from "@/features/tithes/api/use-create-bulk-tithes-records"


function UploadTithesSheetComponent ()
{
    const { isOpen, onClose } = useOpenSheet()
    const { CSVReader } = useCSVReader()
    const [ columnHeaders, setCoulumnHeaders ] = useState( [] )
    const [ dataSet, setDataSet ] = useState( [] )
    
    const columns = useMemo( () => columnHeaders, [ columnHeaders ] )
    const data = useMemo( () => dataSet, [ dataSet ] )

    const {mutate, isPending} = useBulkCreateTithesRecords()
    

    const handleFileUpload = (data:any) =>
    {
        const headers = data?.data[ 0 ].map( ( header: string ) => (
            { header, accessorKey: header } ) )
        
        const responseData = data?.data.slice( 1, data?.data.length - 1 ).map( ( row: any ) => row.reduce( ( acc: any, curr: any, index: number ) =>
        {
            acc[ headers[ index ].accessorKey ] = curr
            return acc;
            
        }, {}))
        
        setCoulumnHeaders( headers )
        setDataSet(responseData)

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
                setCoulumnHeaders( [] )
                setDataSet([])
                onClose()
            }
        })
    }
    
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent side='left' className={cn('w-full h-screen overflow-y-auto border-none', data?.length > 0 && 'md:max-w-7xl')}>
              <SheetHeader>
                  <SheetTitle className="font-semibold text-xl mt-2">
                      Upload a CSV File
                  </SheetTitle>
                  <SheetDescription>
                      Kindly click on the upload input to select a file from your local machine and upload it onto the system. Take note that the selected file must be in a CSV format. 
                  </SheetDescription>
              </SheetHeader>
              <CSVReader
                  onUploadAccepted={ handleFileUpload }
                  onError={handleUploadError}
              >
                  {
                      ( { getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }: any ) => (
                          <>
                              <div className="flex mb-2 mt-6 border rounded-md max-w-sm">
                                  <Button {...getRootProps()} size='sm' className="rounded-none">
                                      <Upload className="size-4 mr-1" />
                                      Choose a File
                                  </Button>
                                  <div
                                      className="w-[70%] h-[45] leading-loose pl-2 flex items-center"
                                  >
                                      {acceptedFile && acceptedFile.name}
                                  </div>
                                    {
                                        acceptedFile && (
                                            <Button {...getRemoveFileProps()} variant='ghost' size='sm'>
                                                <X className="size-4 text-red-500" />
                                            </Button>
                                    )
                                    }
                              </div>
                              <div className="max-w-sm mb-10">
                                  <ProgressBar />
                              </div>
                          </>
                      )
                  }
                  
              </CSVReader>
              <div className="mt-2 mb-2">
                  { data?.length > 0 && (
                      <>
                          <Button
                              size='sm'
                              variant='blue'
                              onClick={handleDataSubmission}
                              disabled={isPending}
                          >
                              { isPending ? ( <span className="flex items-center">
                                  Saving <Loader2 className="size-4 ml-1 animate-spin" />
                              </span>) : (
                                  <span className="flex items-center">
                                      <Save className="size-4 mr-1" />
                                      Save to Database
                                  </span>
                              ) }
                          </Button>
                          <div className="mt-2">
                              <DataTable columns={columns} data={data}/>
                            </div>
                      </>
                  )}
              </div>
        </SheetContent>
    </Sheet>
  )
}

export default UploadTithesSheetComponent
