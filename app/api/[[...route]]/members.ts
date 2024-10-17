import { Hono } from "hono";
import {zValidator} from '@hono/zod-validator'
import { MemberSchema } from "@/app/types/types";
import prisma from "@/lib/db";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { HTTPException } from 'hono/http-exception'
import {v2 as cloudinary} from 'cloudinary'
import { generateSerialNumber } from "@/lib/generateId";
import * as z from 'zod'
import { Prisma } from "@prisma/client";






const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } = process.env

 cloudinary.config( {
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
     api_secret: CLOUDINARY_API_SECRET,
    secure: true
 } )

const extendedMemberSchema = MemberSchema.omit( {
    dateOfBirth: true,
    imageFile: true
} ).extend( {
    dateOfBirth: z.string(),
    imageFile: z.union([z.instanceof(File), z.undefined(), z.string()])
} )


const bulkUploadSchema = extendedMemberSchema.omit( {
    imageFile: true,
    imageUrl: true,
    dateOfBirth: true
} ).extend( {
    dateOfBirth: z.string()
})

const app = new Hono()
    .get(
        '/',
        clerkMiddleware(),
        async ( c ) =>
    {
        const auth = getAuth( c );
        if ( !auth?.userId ) {
            throw new HTTPException( 401, {
                message: "You need to log in to access this route."
            })
        } 
        
            const searchParams = c.req.query( 'q' );
            const page = parseInt( c.req.query( 'page' ) as string ) || 1
            const pageSize = parseInt( c.req.query( 'pageSize' ) as string ) || 10
            const paginate = Boolean(c.req.query('paginate') as string) || false
            const skip = (page -1 ) * pageSize
           
            let query: Prisma.MemberWhereInput = {}
            
            if ( searchParams !== undefined ) {
                
                query = {
                    OR: [
                        { firstName: { contains: searchParams, mode: 'insensitive' } },
                        { lastName: { contains: searchParams, mode: 'insensitive' } },
                        { hometown: { contains: searchParams, mode: 'insensitive' } },
                        { gender: { equals: searchParams, mode: 'insensitive' } },
                        { department: { contains: searchParams, mode: 'insensitive' } }
                        
                    ]
                }
            }

            let data = [];
            let pageCount = 0

            if ( paginate ) {
                
                [data, pageCount] = await prisma.$transaction( [
                    prisma.member.findMany( {
                    where: query,
                    orderBy: { entryYear: 'desc' },
                    take:  pageSize,
                    skip
                    } ),
                    prisma.member.count()
                ] )
                
            } else {
                [data, pageCount] = await prisma.$transaction( [
                    prisma.member.findMany( {
                        where: query
                    } ),
                    prisma.member.count()
                ])
                
            }

            
            return c.json({data, pageCount}, 200)
  
    } )
    .get(
        '/:id',
        clerkMiddleware(),
        zValidator( 'param', z.object({
            id: z.string()
        })),
        async ( c ) =>
        {
            const auth = getAuth( c );
            const { id } = c.req.valid( 'param' )
            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    message: 'You need to log in to access this route'
                })
            }

            
            const data = await prisma.member.findUnique( {
                where: { id: id }
            } );

            if ( !data ) {
                throw new HTTPException( 401, {
                    message: 'Member not found!'
                })
            }

            return c.json({data}, 200)
        }
    )
    .post(
        '/',
        clerkMiddleware(),
        zValidator( 'form', extendedMemberSchema, ( result ) =>
        {
            if ( !result.success ) {
                throw new HTTPException( 400, {
                    message: `Invalid data`
                })
            }
        }),
        async( c ) =>
    {
        const auth = getAuth( c );
        if(!auth?.userId){
            throw new HTTPException( 401, {
                message: 'You need to log in to access this route'
            })
        }
        
            let validSchema = c.req.valid( 'form' );
            
            if ( validSchema.imageFile !== 'undefined' ) {
                
                const file = validSchema.imageFile as File;
                const arrayBuffer = await file.arrayBuffer();
                const buffer = new Uint8Array( arrayBuffer );

                const uploadedResponse:any = await new Promise( ( resolve, reject ) =>
                {
                    cloudinary.uploader.upload_stream( {}, ( err, result ) =>
                    {
                        if ( err ) {
                            return reject(err)
                        }
                        return resolve(result)
                    } ).end( buffer )
                })

                if ( 'secure_url' in uploadedResponse ) {
                    validSchema.imageUrl = uploadedResponse.secure_url as string
                    const imageFile = 'imageFile'
                    delete validSchema[imageFile]
                }
            }else{
                const { imageFile, ...rest } = validSchema
                validSchema = rest
            }

            const date = validSchema.dateOfBirth.toString().split('T')[0]
            const formattedEntryYear = parseInt(validSchema.entryYear as string)

            const serialNumber = generateSerialNumber( 'AG', `${validSchema.entryYear}`, 3 )
            const data = await prisma.member.create( {
                data: {
                    ...validSchema,
                    serialNumber: serialNumber,
                    entryYear: formattedEntryYear,
                    dateOfBirth: date,
                    gender: validSchema.gender as string,
                    phoneNumber: validSchema.phoneNumber as string
                }
            })
            
        return c.json({data}, 201)
        } )
    .post(
        '/bulk-delete',
        clerkMiddleware(),
        zValidator( 'json', z.object( {
            ids: z.array(z.string())
        } ) ),
        
        async ( c ) =>
        {
            const auth = getAuth( c );
            const values = c.req.valid( 'json' );
            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    message: 'You need to log in to access this route'
                })
            }
            const data = await prisma.member.deleteMany( { where: { id: { in: values.ids  } } } )
            return c.json({data}, 200)
        } )
    .post(
        '/bulk-create',
        clerkMiddleware(),
        zValidator( 'json', z.object( {
           json: z.array(bulkUploadSchema)
        } ) ), 
        async ( c ) =>
        {
            const auth = getAuth( c )
            const { json } = c.req.valid( 'json' );

            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    message: "You need to log in to access this route."
                })
            }

            const dataWithSerialNumbers = json.map( person => (
                { ...person, serialNumber: generateSerialNumber( 'AG', `${ person.entryYear }`, 3 ), gender:person.gender as string, entryYear: Number(person.entryYear) } ) );

            const data = await prisma.member.createMany({data: dataWithSerialNumbers})

            return c.json( { data }, 201)
        
        }
    )
    .patch(
    '/:id',
    clerkMiddleware(),
    zValidator( 'param', z.object( {
        id: z.string()
    } ) ),
    zValidator( 'form', extendedMemberSchema ),
    async ( c ) =>
    {
        const auth = getAuth( c );
        const { id } = c.req.valid( 'param' );
        const validData = c.req.valid( 'form' );

        if ( !auth?.userId ) {
            throw new HTTPException( 401, {
                message: 'You need to log in to access this route'
            })
        }

        if ( !id ) {
            throw new HTTPException( 400, {
                message: 'Missing a valid ID'
            })
        }

        if ( validData.imageFile === 'undefined' ) {
            const imageFile = 'imageFile';
            delete validData[imageFile]
        }

        if ( validData.imageFile instanceof File) {
            const file = validData.imageFile as File;
            const arraybuffer = await file.arrayBuffer();
            const buffer = new Uint8Array( arraybuffer );

            const uploadResponse: any = await new Promise( ( resolve, reject ) =>
            {
                cloudinary.uploader.upload_stream( { overwrite: true }, ( err, result ) =>
                {
                    if ( err ) {
                        reject( err )
                    }
                    resolve( result );

                } ).end( buffer )
            } );

            if ( 'secure_url' in uploadResponse ) {
                validData.imageUrl = uploadResponse.secure_url;
                const imageFile = 'imageFile';
                delete validData[imageFile]
            }
        }
        const data = await prisma.member.update( {
            where: { id: id },
            data: {
                ...validData,
                entryYear: Number( validData.entryYear )
            }
        } )
        
        return c.json( { data }, 201 )
        
        } )
    .delete(
        '/:id',
        clerkMiddleware(),
        zValidator( 'param', z.object( {
            id: z.string()
        } ) ),
        async ( c ) =>
        {
            const auth = getAuth( c );
            const validParam = c.req.valid( 'param' );

            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    message: "You need to log in to access this route."
                })
            }

            if ( !validParam.id ) {
                throw new HTTPException( 400, {
                    message: "Missing a valid ID"
                })
            }

            const data = await prisma.member.delete( { where: { id: validParam.id  } } );

            if ( !data ) {
                throw new HTTPException( 404, {
                    message: "member doesn't exist"
                })
            }
            return c.json( { data } )
        
        }
    )
    

export default app