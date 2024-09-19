import OpenTitheForm from '@/components/OpenTitheForm'
import RenderTithes from '@/components/render-tithes'
import {Tabs, TabsContent, TabsTrigger, TabsList} from '@/components/ui/tabs'

function IncomePage ()
{
  
  return (
    <div className='-mt-4'>
      <div className='h-16 w-full p-4 bg-gray-100 mb-5 lg:-mr-6 '>
          <h1 className='text-xl font-bold'>Income</h1>
      </div>
      <div>
        <Tabs defaultValue='Tithes'>
          <TabsList className='space-x-2'>
            <TabsTrigger className='font-medium text-base' value='Tithes'>Tithes</TabsTrigger>
            <TabsTrigger className='font-medium text-base' value='Offering'>Offerings</TabsTrigger>
          </TabsList>
          <TabsContent value='Tithes'>
              <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>List of Tithes</h1>
                <OpenTitheForm />
              </div>
            <div>
              <RenderTithes />
              </div>
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
