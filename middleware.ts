import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


const isProtectedRoute = createRouteMatcher(
    ['/', '/members']
)

export default clerkMiddleware( (auth, req) =>
{
    if ( isProtectedRoute( req ) ) auth().protect()
})

export const config = {
    matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
}