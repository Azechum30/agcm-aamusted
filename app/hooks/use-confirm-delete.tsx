import { Button } from "@/components/ui/button";
import
    {
        AlertDialog,
        AlertDialogContent,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogDescription,
        AlertDialogTrigger,
        AlertDialogFooter
} from '@/components/ui/alert-dialog'
import { useState } from "react";

export const useConfirmDelete = (title: string, description:string):[()=>JSX.Element, ()=> Promise<unknown>] =>
{
    const [ promise, setPromise ] = useState<{ resolve: (value: boolean) => void } | null>( null )
    
    const confirm = () => new Promise( ( resolve, reject ) =>
    {
        setPromise({ resolve })
    } )
    
    const handleClose = () =>
    {
        setPromise(null)
    }

    const handleConfirm = () =>
    {
        promise?.resolve( true )
        handleClose()
    }

    const handleCancel = () =>
    {
        promise?.resolve( false )
        handleClose()
    }


    const DeleteAlertComponent = () =>
    {
        return (
            <AlertDialog open={!!promise?.resolve} onOpenChange={handleClose}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{ title }</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                    <AlertDialogFooter className="pt-2">
                        <Button
                            variant='destructive'
                            size='sm'
                            onClick={handleConfirm}
                        >
                            Continue
                        </Button>
                        <Button
                            variant='blue'
                            size='sm'
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    return [DeleteAlertComponent, confirm]
}