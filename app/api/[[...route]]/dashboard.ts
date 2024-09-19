import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { HTTPException } from "hono/http-exception";
import prisma from "@/lib/db";

const app = new Hono()
.get( '/',
    clerkMiddleware(),
    async ( c ) =>
{
        const auth = getAuth( c )
        if ( !auth?.userId ) {
            throw new HTTPException( 401, {
                res: c.json({error: 'Unauthenticated'}, 401)
            })
        }

        const memberMetrics = await Promise.allSettled( [
            prisma.member.count(),
            prisma.member.count( { where: { gender: 'male' } } ),
            prisma.member.count({where:{gender: 'female'}})
        ] )
        
        let data: number[] = []
        memberMetrics.forEach( metric =>
        {
            if ( metric.status === 'fulfilled' ) {
                data.push(metric.value)
            }
        })

        

    return c.json({data}, 200)
})


export default app;