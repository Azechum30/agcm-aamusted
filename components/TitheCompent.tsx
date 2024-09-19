import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog'
import { useCreateTithe } from '@/app/hooks/use-create-tithe'

import React from 'react'
import CreateTitheRecord from '@/app/forms/create-tithe-form'
import { useCreateTitheRecord } from '@/features/tithes/api/use-create-tithe-record'
import { TitheType } from '@/app/types/types'

function TitheComponent ()
{
    const { isOpen, onClose } = useCreateTithe()
    const { mutate, isPending} = useCreateTitheRecord()

    
    const defaultValues:TitheType = {
        amount: 0.00,
        paymentDate: new Date(),
        paymentMethod: '',
        memberId: ''
    }

    function handleSubmit (values:TitheType)
    {

        mutate(
            values, {
            onSuccess: () =>
            {
                onClose()
            }
        })
    }

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay>
              <DialogContent>
                  <CreateTitheRecord
                      onSubmit={ handleSubmit }
                      disabled={ isPending }
                      defaultValues={ defaultValues }
                  />
              </DialogContent>
          </DialogOverlay>
    </Dialog>
  )
}

export default TitheComponent
