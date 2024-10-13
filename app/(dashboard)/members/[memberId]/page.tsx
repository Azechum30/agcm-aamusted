'use client'
import { useGetMember } from "@/features/members/api/use-get-member"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import {Card, CardHeader, CardDescription, CardContent, CardTitle} from '@/components/ui/card'
import { toast } from "sonner"

type Props = {
    params: {
        memberId: string
    }
}

function MemberDetailPage ( { params }: Props )
{
    const {data, isLoading, isError, error } = useGetMember(params.memberId)

    if ( isLoading ) {
        return <span className="w-full h-screen flex justify-center items-center">
            <Loader2 className="size-6 animate-spin" />
        </span>
    }
    isError && toast.error(error.message)
  return (
    <Card className="shadow-none -mt-4">
          <CardHeader className="border-b mb-6 text-center md:text-left h-16 bg-gray-100">
              <CardTitle className="-mt-2" >
                  Member Details
              </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="w-11/12 mx-auto flex flex-col  items-center justify-center mb-6">
                  <Image
                      src={ data?.imageUrl!  || '/noAvatar.png'}
                      alt="Profile Picture"
                      height={ 100 } width={ 100 }
                      className="w-44 h-44 object-cover object-top rounded-full "
                  />
                  <p className='text-muted-foreground text-sm mt-3'>Serial Number: <strong>{data?.serialNumber}</strong></p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:space-x-4 space-y-4 sm:space-y-0">
                  <div>
                      <h3 className="mb-3 font-bold">Personal Data</h3>
                      <div className="flex justify-between items-center border p-3 text-sm">
                          <p className="font-semibold">First Name:</p>
                          <p>{data?.firstName}</p>
                      </div>
                      <div className="flex justify-between items-center border p-3 border-t-0 text-sm">
                          <p className="font-semibold">Last Name:</p>
                          <p>{data?.lastName}</p>
                      </div>
                      <div className="flex justify-between items-center border p-3 border-t-0 text-sm">
                          <p className="font-semibold">Gender:</p>
                          <p>{data?.gender}</p>
                      </div>
                      <div className="flex justify-between items-center border p-3 border-t-0 text-sm">
                          <p className="font-semibold">Date of Birth:</p>
                          <p>{new Date(data?.dateOfBirth!).toLocaleDateString()}</p>
                      </div>
                      <div className="flex justify-between items-center border p-3 border-t-0 text-sm">
                          <p className="font-semibold">Email Address:</p>
                          <p>{data?.email}</p>
                      </div>
                      <div className="flex justify-between items-center border p-3 border-t-0 text-sm">
                          <p className="font-semibold">Phone Number:</p>
                          <p>{data?.phoneNumber}</p>
                      </div>
                      <div className="flex justify-between items-center border p-3 border-t-0 text-sm">
                          <p className="font-semibold">Hometown:</p>
                          <p>{data?.hometown}</p>
                      </div>
                  </div>
                  <div>
                      <h3 className="mb-3 font-bold">School/Church Data</h3>
                      <div className="flex justify-between items-center border p-3 text-sm">
                          <p className="font-semibold">Year of Enrollment:</p>
                          <p>{data?.entryYear}</p>
                      </div>
                      <div className="flex justify-between items-center border p-3 border-t-0 text-sm">
                          <p className="font-semibold">Programme:</p>
                          <p>{data?.course}</p>
                      </div>
                      <div className="flex justify-between items-center border p-3 border-t-0 text-sm">
                          <p className="font-semibold">Hostel/Hall:</p>
                          <p>{data?.hostel}</p>
                      </div>
                      <div className="flex justify-between items-center border p-3 border-t-0 text-sm">
                          <p className="font-semibold">Department (in Church):</p>
                          <p>{data?.department}</p>
                      </div>
                  </div>
              </div>
          </CardContent>
    </Card>
  )
}

export default MemberDetailPage
