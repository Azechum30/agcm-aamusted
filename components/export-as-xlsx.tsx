
import xlsx, { IContent } from "json-as-xlsx"
import { Button } from "./ui/button"
import { Download } from "lucide-react"



type ExportTypes<T extends IContent> = {
    data: T[],
    filename?: string
}

function ExportAsXLSX<T extends IContent> ( { data, filename }: ExportTypes<T> )
{
    

    const handleExport = () =>
    {
        const settings = {
            fileName: filename || "export",
            extraLength: 3,
            writeOptions: {}
        }

        const formattedData = [{
            sheet: 'Sheet 1',
            columns: Object.keys( data[0] ).map( key => ( { label: key, value: key } ) ).slice(1),
            content: data
        } ]
        
        xlsx(formattedData, settings)
    }
  return (
    <div className="w-full md:w-auto">
          <Button size='sm' className="w-full" onClick={handleExport}>
              <Download className="size-4 mr-1" />
              Export as Excel
      </Button>
    </div>
  )
}

export default ExportAsXLSX
