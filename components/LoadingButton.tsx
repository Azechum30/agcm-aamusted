import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"


function LoadingButton({buttonText = 'Loading'}:{buttonText?: string}) {
  return (
      <Button variant='secondary' disabled className="hover:cursor-not-allowed w-full">
          {buttonText} <Loader2  className='w-4 h-4 ml-2 animate-spin'/>
    </Button>
  )
}

export default LoadingButton
