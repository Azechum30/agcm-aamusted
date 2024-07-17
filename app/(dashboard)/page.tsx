import Statistics from "@/components/Statistics";
import { LoaderPinwheel } from "lucide-react";
import { Suspense } from "react";

export default function HomePage ()
{
    return (
        <>
            <div className="bg-gray-100 h-16 border-b mb-6 -mt-4 lg:-mr-6  p-4">
                <h1 className="text-xl font-bold">Statistics</h1>
            </div>
            <Suspense fallback={<span className='w-full h-full flex justify-center items-center'> <LoaderPinwheel className="size-6 animate-spin" /> </span>}>
                <Statistics />
            </Suspense>
        </>
    )
}