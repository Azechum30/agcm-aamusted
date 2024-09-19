import {Popover, PopoverTrigger, PopoverContent} from '@/components/ui/popover'
import {Command, CommandEmpty, CommandList, CommandItem, CommandInput, CommandGroup} from '@/components/ui/command'
import { Button } from './ui/button'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useState } from 'react'

function Combobox ()
{

    const { data, isLoading } = useGetMembers()
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    
  return (
    <Popover>
          <PopoverTrigger asChild>
              <Button variant='outline' className=' w-[200px] justify-between' role='combobox'>
                  
              </Button>
      </PopoverTrigger>
    </Popover>
  )
}

export default Combobox
