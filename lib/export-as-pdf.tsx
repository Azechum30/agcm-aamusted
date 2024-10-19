import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { ArrowBigDown } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";


type TPDFProps = {
    title: string,
    filename: string,
    data: any[]

}

export default function ExportAsPDF ({title, filename, data}:TPDFProps)
{

    const isAdmin = useUser().user?.organizationMemberships?.[ 0 ]?.role === 'org:admin'
    
    if ( !isAdmin ) {
        toast.error( "You do not have the right permissions to perform this operation" )
        throw new Error("You do not have permissions to perform this operation")
    }

    function handleExport ()
    {
        const doc = new jsPDF({orientation: 'landscape'});
        doc.setFontSize( 20 )
        doc.text( title, 20, 20 )
        
        const headers = Object.keys(data[0]).map(key => ({title:key, dataKey: key}))

        const header = headers.map(header => header.title)
        autoTable( doc, {
            startY: 30,
            head: [header],
            body: data.map(row => headers.map(col=> row[col.dataKey])),
            theme: 'grid',
        })

        doc.save(`${filename}.pdf`)
    }

    return (
        <Button
            disabled={ data?.length === 0 }
            onClick={ handleExport }
            size='sm'
            variant='destructive'
            className="w-full md:w-auto"
        >
            <ArrowBigDown className="size-4 mr-1" />
            Export as PDF
        </Button>
    )
    
}