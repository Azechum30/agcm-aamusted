import { ReactNode } from "react";

export default function AuthLayout ( { children }: { children: ReactNode } )
{
    return (
        <div className="min-h-screen flex justify-center items-center container mx-auto">
            {children}
        </div>
    )
}