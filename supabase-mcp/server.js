import { createServer } from "@modelcontextprotocol/sdk/server.js"
import pkg from "pg"
const { Client } = pkg

// Connect to Supabase Postgres
const client = new Client({
  host: process.env.SUPABASE_HOST,
  port: 5432,
  user: "postgres",
  password: process.env.SUPABASE_PASSWORD,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
})

await client.connect()

// Helper: run SQL safely
async function runQuery(sql, params = []) {
  try {
    const res = await client.query(sql, params)
    return { rows: res.rows }
  } catch (err) {
    return { error: err.message }
  }
}

// MCP server definition
const server = createServer({
  name: "supabase",

  resources: {
    // 1. Database
    async list_tables() {
      return runQuery(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema='public'
      `)
    },

    async run_query({ sql }) {
      return runQuery(sql)
    },

    async create_table({ table_name, columns }) {
      const cols = columns.map(c => `${c.name} ${c.type}`).join(", ")
      return runQuery(`CREATE TABLE IF NOT EXISTS ${table_name} (${cols})`)
    },

    // 2. Storage
    async create_bucket({ bucket_name, is_public = true }) {
      return runQuery(
        `select storage.create_bucket($1, $2)`,
        [bucket_name, is_public]
      )
    },

    async list_buckets() {
      return runQuery(`select * from storage.buckets`)
    },

    // 3. Middleware / Auth Helpers
    async generate_middleware({ protectedRoutes = [] }) {
      return {
        code: `
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const protectedRoutes = ${JSON.stringify(protectedRoutes)}

  if (!user && protectedRoutes.some(r => request.nextUrl.pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}
        `.trim()
      }
    },

    async generate_rls_policy({ table, action = "select", condition }) {
      return {
        sql: `
create policy "auto_policy_${Date.now()}"
on ${table}
for ${action}
using (${condition});
        `.trim()
      }
    }
  }
})

server.start()
