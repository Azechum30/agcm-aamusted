import { Hono } from "hono";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { TitheSchema } from "@/app/types/types";
import prisma from "@/lib/db";
import {z} from 'zod'





const NewTitheSchema = TitheSchema.omit( {
    paymentDate: true
} ).extend( {
    paymentDate: z.union([z.string(), z.date()])
})

const app = new Hono()
    .get(
        '/', 
        clerkMiddleware(),
        async ( c ) =>
        {
            const auth = getAuth( c )
            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    res: c.json({error: "Unauthenticated!"}, 401)
                })
            }

            const data = await prisma.tithe.findMany()
            return c.json({data}, 200)
        }
)
    .get(
        '/:id',
        clerkMiddleware(),
        zValidator( 'param', z.object( {
            id: z.string()
        } ) ),
        async ( c ) =>
        {
            const auth = getAuth( c )
            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    res: c.json({error: 'Unauthenicated!'}, 401)
                }) 
            }

            const {id} = c.req.valid( 'param' );
            const data = await prisma.tithe.findUnique( { where: { id: id } } )
            
            return c.json( { data }, 200 )
            
        }
    )
    .post(
        '/',
        clerkMiddleware(),
        zValidator('json', NewTitheSchema),
        async ( c ) =>
        {
            const auth = getAuth( c );
            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    res: c.json({error: 'Unauthenticated'}, 401)
                })
            }

            const validData = c.req.valid( 'json' )
            const data = await prisma.tithe.create( { data: { ...validData } } )
            
            return c.json( { data }, 201)
        }
)
    .patch(
        '/:id',
        clerkMiddleware(),
        zValidator( 'param', z.object( {
            id: z.string().optional()
        })),
        zValidator( 'json', NewTitheSchema ),
        async ( c ) =>
        {
            const auth = getAuth( c )
            const { id } = c.req.valid( 'param' )
            const validData = c.req.valid( 'json' )

            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    res: c.json({error: "Unauthenticated"}, 401)
                })
            }


            if ( !id ) {
                throw new HTTPException( 400, {
                    res: c.json({error: "Missing a valid param"}, 400)
                })
            }
            
            const data = await prisma.tithe.update( { where: { id: id }, data: { ...validData } } )
            
            return c.json({data}, 201)
        }
)
    .delete(
        '/:id',
        clerkMiddleware(),
        zValidator( 'param', z.object( {
            id: z.string().optional()
        } ) ),
        async ( c ) =>
        {
            const auth = getAuth( c )
            const { id } = c.req.valid( 'param' )
            
            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    res: c.json({error: "Unauthenticated!"}, 401)
                })
            }

            if ( !id ) {
                throw new HTTPException( 400, {
                    res: c.json({error: "Missing a valid ID!"}, 400)
                })
            }

            const data = await prisma.tithe.delete( { where: { id: id } } )
            return c.json({data}, 200)
        }
    )


export default app