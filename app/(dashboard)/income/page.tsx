
import OpenTitheForm from '@/components/OpenTitheForm'
import RenderTithes from '@/components/render-tithes'
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs'
import { auth } from '@clerk/nextjs/server'


function IncomePage ()
{
  
  const claims = auth().sessionClaims
  const {orgPermissions } = auth()
  
  // const hasPermissions = has({permission: "org:data:export"})
  const isAdmin = claims?.metadata.role
  console.log( isAdmin )
  console.log( claims )
  console.log("Permissions: ", orgPermissions)

  return (
    <div className='-mt-4'>
      <div>
        <Tabs defaultValue='Tithes'>
          <TabsList className='space-x-4 w-full justify-start'>
            <TabsTrigger className='font-medium text-base w-full md:w-auto' value='Tithes'>Tithes</TabsTrigger>
            <TabsTrigger className='font-medium text-base w-full md:w-auto' value='Offering'>Offerings</TabsTrigger>
          </TabsList>
          <TabsContent value='Tithes'>
              <div className='flex justify-between items-center'>
                <h1 className='hidden md:block text-base font-semibold'>All Tithes</h1>
                {isAdmin === 'org:admin' && <OpenTitheForm />}
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
