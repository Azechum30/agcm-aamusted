import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Calendar } from './ui/calendar'
import { Button } from './ui/button'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

type DatePickerProps = {
    date: Date,
    setDate: ()=> void
}

function DatePicker({date, setDate}:DatePickerProps) {
  return (
      <Popover>
          <PopoverTrigger asChild>
              <Button
                  variant='outline'
                  className={cn('w-full justify-start text-start font-normal', {'text-muted-foreground': !date})}
              >
                  <CalendarIcon className='w-4 h-4 mr-2' />
                  {date ? format(date, 'PPP'): <span>Select a date</span>}
              </Button>
          </PopoverTrigger>
          <PopoverContent>
              <Calendar
                  mode='single'
                  selected={ date }
                  onSelect={setDate}
                  initialFocus
              />
          </PopoverContent>
    </Popover>
  )
}

export default DatePicker
