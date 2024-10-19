
import RenderTithes from '@/components/render-tithes'
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs'

function IncomePage ()
{
  return (
    <div className='-mt-4'>
      <div>
        <Tabs defaultValue='Tithes'>
          <TabsList className='space-x-4 w-full justify-start'>
            <TabsTrigger className='font-medium text-base w-full md:w-auto' value='Tithes'>Tithes</TabsTrigger>
            <TabsTrigger className='font-medium text-base w-full md:w-auto' value='Offering'>Offerings</TabsTrigger>
          </TabsList>
          <TabsContent value='Tithes'>
              <RenderTithes />
          </TabsContent>
          <TabsContent value='Offering'>
            <h1>Offerings Page</h1>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default IncomePage
