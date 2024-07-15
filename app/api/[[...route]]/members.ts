import { Hono } from "hono";
import {zValidator} from '@hono/zod-validator'
import { MemberSchema } from "@/app/types/types";
import prisma from "@/lib/db";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { HTTPException } from 'hono/http-exception'
import {v2 as cloudinary} from 'cloudinary'
import { generateSerialNumber } from "@/lib/generateId";
import * as z from 'zod'






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
                res: c.json({error: 'Unauthenticated'}, 401)
            })
        } 
        
            const searchParams = c.req.query( 'q' );
            let data = await prisma.members.findMany( {orderBy: {entryYear: 'desc'}} )
            if ( searchParams ) {
                
                const searchRegex = new RegExp(searchParams, 'i')
                data = data.filter( member =>
                {
                    return searchRegex.test(member.firstName) || searchRegex.test(member.lastName)
                } )

            }
            return c.json({data}, 200)
  
    } )
    .get(
        '/:id',
        clerkMiddleware(),
        zValidator( 'param', z.object({
            id: z.coerce.number().positive().optional()
        })),
        async ( c ) =>
        {
            const auth = getAuth( c );
            const { id } = c.req.valid( 'param' )
            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    res: c.json({error: 'Unauthorized!'}, 401)
                })
            }

            if ( !id ) {
                throw new HTTPException( 401, {
                    res: c.json({error: 'Missing Id!'}, 400)
                })
            }
            
            const data = await prisma.members.findUnique( {
                where: { id: id }
            } );

            if ( !data ) {
                throw new HTTPException( 401, {
                    res: c.json({error: 'Member not found!'}, 404)
                })
            }

            return c.json({data}, 200)
        }
    )
    .post(
        '/',
        clerkMiddleware(),
        zValidator('form', extendedMemberSchema),
        async( c ) =>
    {
        const auth = getAuth( c );
        if(!auth?.userId){
            throw new HTTPException( 401, {
                res: c.json({error: 'Unauthenticated'}, 401)
            })
        }
        
            const validSchema = c.req.valid('form');
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

            const date = validSchema.dateOfBirth.toString().split('T')[0]
            const formattedEntryYear = parseInt(validSchema.entryYear as string)

            const serialNumber = generateSerialNumber( 'AG', `${validSchema.entryYear}`, 3 )
            const data = await prisma.members.create( {
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
            ids: z.array(z.number().positive())
        } ) ),
        
        async ( c ) =>
        {
            const auth = getAuth( c );
            const values = c.req.valid( 'json' );
            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    res: c.json({error : 'Unauthorized'}, 401)
                })
            }
            const data = await prisma.members.deleteMany( { where: { id: { in: values.ids  } } } )
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
                    res: c.json({error: 'Unauthenticated'}, 401)
                })
            }

            const dataWithSerialNumbers = json.map( person => (
                { ...person, serialNumber: generateSerialNumber( 'AG', `${ person.entryYear }`, 3 ), gender:person.gender as string, entryYear: Number(person.entryYear) } ) );

            console.log( dataWithSerialNumbers );

            const data = await prisma.members.createMany({data: dataWithSerialNumbers})

            return c.json( { data }, 201)
        
        }
    )
    .patch(
    '/:id',
    clerkMiddleware(),
    zValidator( 'param', z.object( {
        id: z.coerce.number().optional()
    } ) ),
    zValidator( 'form', extendedMemberSchema ),
    async ( c ) =>
    {
        const auth = getAuth( c );
        const { id } = c.req.valid( 'param' );
        const validData = c.req.valid( 'form' );

        if ( !auth?.userId ) {
            throw new HTTPException( 401, {
                res: c.json( { error: 'Unauthorized' }, 401 ),
                message: 'you are not authenticated'
            })
        }

        if ( !id ) {
            throw new HTTPException( 400, {
                res: c.json( { error: 'Missing a valid Id' }, 400 ),
                cause: 'Missing Id',
                message: 'You did not provide a valid param'
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
        const data = await prisma.members.update( {
            where: { id: id },
            data: {
                ...validData,
                entryYear: Number( validData.entryYear )
            }
        } )
        
        if ( !data ) {
            throw new HTTPException( 404, {
                res: c.json({error: 'Not found'}, 404)
            })
        }
        return c.json({data}, 201)
        } )
    .delete(
        '/:id',
        clerkMiddleware(),
        zValidator( 'param', z.object( {
            id: z.string().optional()
        } ) ),
        async ( c ) =>
        {
            const auth = getAuth( c );
            const validParam = c.req.valid( 'param' );

            if ( !auth?.userId ) {
                throw new HTTPException( 401, {
                    res: c.json({error: 'Unauthorized'}, 401)
                })
            }

            if ( !validParam.id ) {
                throw new HTTPException( 400, {
                    res: c.json({error: 'Missing a valid Id'}, 400)
                })
            }

            const data = await prisma.members.delete( { where: { id: Number( validParam.id ) } } );

            if ( !data ) {
                throw new HTTPException( 404, {
                    res: c.json({error: 'Not found'}, 404)
                })
            }
            return c.json({data})
        }
    )
    

export default app