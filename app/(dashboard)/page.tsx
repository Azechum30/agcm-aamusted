import NewlyAddedMembers from "@/components/NewlyAddedMembers";
import Statistics from "@/components/Statistics";


export default function HomePage ()
{
    return (
        <>
            <div className="bg-gray-100 h-16 border-b mb-6 -mt-4 lg:-mr-6  p-4">
                <h1 className="text-xl font-bold">Metrics</h1>
            </div>
            <Statistics />
            <NewlyAddedMembers />
        </>
    )
}