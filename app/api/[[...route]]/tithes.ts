import { Hono } from "hono";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { TitheSchema } from "@/app/types/types";
import prisma from "@/lib/db";
import {z} from 'zod'
import { endOfMonth, isDate, startOfMonth } from "date-fns";
import { Prisma } from "@prisma/client";






const NewTitheSchema = TitheSchema.omit( {
    paymentDate: true
} ).extend( {
    paymentDate: z.union([z.string(), z.date()])
})

const BulkTitheSchema = NewTitheSchema.omit( {
    memberId: true
} ).extend( {
    serialNumber: z.string()
})

const app = new Hono()
    .get(
        '/', 
        clerkMiddleware(),
        async ( c ) =>
        {
            const auth = getAuth( c )
            const searchParams = c.req.query( 'q' )
            const page = parseInt( c.req.query( 'page' ) as string ) || 1
            const pageSize = parseInt( c.req.query( 'pageSize' ) as string ) || 10
            const skip = (page - 1) * pageSize
            
            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    message: 'unauthenticated!'
                })
            }

            let query: Prisma.TitheWhereInput = {}
            
            if ( searchParams !== undefined ) {
                const parsedDate = new Date( searchParams )
                const parsedNumber = parseInt( searchParams )
                const isValidDate = isDate( parsedDate )
                const isValidNumber = !isNaN(parsedNumber)
                
                
                if (isValidNumber && !searchParams.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/) ) {
                    query.amount = { equals: parsedNumber }

                } else if ( isValidDate ) {

                    const startDate = startOfMonth( parsedDate )
                    const endDate = endOfMonth(parsedDate)
                    query.paymentDate = { gte: startDate, lte: endDate }
                    
                } else {
                    query.paymentMethod = {  contains: searchParams, mode: 'insensitive' } 
                }
            }


            const [response, totalRecords ]= await prisma.$transaction( [
                prisma.tithe.findMany( {
                    where: query,
                    skip,
                    take: pageSize
                } ),
                prisma.tithe.count()
            ])
            const data = await Promise.all(
                response.map( async ( item ) =>
                {
                    const date = new Date( item.paymentDate );
                    const formattedDate = date.toLocaleDateString();
                
                    const data = await prisma.member.findFirst( {
                        where: {
                            id: item.memberId
                        }
                    } )

                    
                    return {
                        ...item,
                        paymentDate: formattedDate,
                        memberId: `${ data?.firstName } ${ data?.lastName }`,
                    }

                })
            )

            return c.json({data, totalRecords}, 200)
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
                    message: "unauthenticated!"
                }) 
            }

            const { id } = c.req.valid( 'param' );
            
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
                    message: "unauthenticated!"
                })
            }

            const validData = c.req.valid( 'json' )

            const startOfCurrentMonth = startOfMonth( new Date( validData.paymentDate ) )
            const endOfCurrentMonth = endOfMonth( new Date( validData.paymentDate ) )
            
            const existingPayment = await prisma.tithe.findFirst( { where: { memberId: validData.memberId, paymentDate: { gte: startOfCurrentMonth, lte: endOfCurrentMonth } } } )
            
            if ( existingPayment ) {
                throw new HTTPException( 409, {
                    message: "This member has already paid tithe for this month!"
                })

            }
            const data = await prisma.tithe.create( { data: validData  } )
            
            return c.json( { data }, 201)
        }
)
    .patch(
        '/:id',
        clerkMiddleware(),
        zValidator( 'param', z.object( {
            id: z.string()
        })),
        zValidator( 'json', NewTitheSchema ),
        async ( c ) =>
        {
            const auth = getAuth( c )
            const { id } = c.req.valid( 'param' )
            const validData = c.req.valid( 'json' )

            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                   message: "unauthenticated!"
                })
            }
            
            const data = await prisma.tithe.update( { where: { id: id }, data: validData } )
            
            return c.json({data}, 201)
        }
)
    .delete(
        '/:id',
        clerkMiddleware(),
        zValidator( 'param', z.object( {
            id: z.string()
        } ) ),
        async ( c ) =>
        {
            const auth = getAuth( c )
            const { id } = c.req.valid( 'param' )
            
            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    message: "unauthenticated!"
                })
            }

            const data = await prisma.tithe.delete( { where: { id: id } } )
            return c.json({data}, 200)
        }
)
    .post(
        '/bulk-delete',
        clerkMiddleware(),
        zValidator( 'json', z.object( {
            ids: z.array(z.string())
        } ) ),
        async ( c ) =>
        {
            const auth = getAuth(c)
            const { ids } = c.req.valid( 'json' )
            
            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    message: "unauthenticated!"
                })
            }

            const {count} = await prisma.tithe.deleteMany( { where: { id: { in: ids } } } )
            return c.json({ count }, 200)
        }
)
    .post(
        '/bulk-create',
        clerkMiddleware(),
        zValidator( 'json', z.array(BulkTitheSchema) ),
        async ( c ) =>
        {
            const auth = getAuth( c );
            const validJsonData = c.req.valid( 'json' )
            
            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    message: 'unauthenticated!'
                })
            }

            const members = await prisma.member.findMany()
            const uploadData = await Promise.all(
                validJsonData.map( async(item) =>
                {
                    item.paymentDate = new Date( item.paymentDate );
                    const { serialNumber, ...rest } = item;
                    const object = { memberId: serialNumber, ...rest }

                    members.forEach( member =>
                    {
                        if ( member.serialNumber === object.memberId ) {
                            object.memberId = member.id
                        }
                    } );

                    const existingPayment = await prisma.tithe.findFirst( {
                        where: {
                            memberId: object.memberId,
                            paymentDate: {
                                gte: startOfMonth( new Date( object.paymentDate ) ),
                                lte: endOfMonth( new Date( object.paymentDate ) )
                            }
                        }
                    } );
                    

                    return existingPayment ? null: object
                } )
                
            )
               
            const filteredData:Prisma.TitheCreateManyInput[] = uploadData.filter( item => item !== null )
            const data = (await prisma.tithe.createMany( { data: filteredData } )).count
            
            return c.json({data})

        }
    )


export default app