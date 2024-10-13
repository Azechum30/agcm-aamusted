import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import members from './members'
import dashboard from './dashboard'
import tithes from './tithes'
import { HTTPException } from 'hono/http-exception'

// export const runtime = 'nodejs'
const app = new Hono().basePath( '/api' )

app.onError( ( err, c ) =>
{
    console.error( err )
    if ( err instanceof HTTPException ) {
        
        return c.json({ error: err.message }, err.status)
    }

    return c.json({error: "Internal server error"}, 500)
})

const routes = app
    .route('/', dashboard)
    .route( '/members', members )
    .route('/tithes', tithes)


export const GET = handle( app )
export const POST = handle( app )
export const PATCH = handle( app )
export const DELETE = handle( app )

export type AppType = typeof routes