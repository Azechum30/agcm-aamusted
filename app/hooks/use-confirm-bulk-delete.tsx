import { Button } from '@/components/ui/button';
import { Dialog,  DialogHeader, DialogContent, DialogDescription, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { useState } from 'react';

export const useConfirmBulkDelete = (title:string, description:string):[()=>JSX.Element, ()=> Promise<unknown>] =>
{
    const [ promise, setPromise ] = useState<{ resolve: ( value: boolean ) => void } | null>( null )
    
    const confirm = () => new Promise( ( resolve, reject ) =>
    {
        setPromise( { resolve } )
    } );

    const handleClose = () =>
    {
        setPromise(null)
    }

    const handleConfirm = () =>
    {
        promise?.resolve( true )
        handleCancel()
    }

    const handleCancel = () =>
    {
        promise?.resolve( false )
        handleClose()
    }

    const BulkDeleteDialog = () =>
    {
        return (
            <Dialog open={ !!promise?.resolve } onOpenChange={ handleCancel }>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{ title }</DialogTitle>
                        <DialogDescription className='pt-2'>{description}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='pt-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='destructive'
                            size='sm'
                            onClick={handleConfirm}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return [BulkDeleteDialog, confirm]
}