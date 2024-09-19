import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import members from './members'
import dashboard from './dashboard'
import tithes from './tithes'

// export const runtime = 'nodejs'
const app = new Hono().basePath( '/api' )

app.onError( ( err, c ) =>
{
    console.error( err )
    return c.json({error: 'Internal server error'}, 500)
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