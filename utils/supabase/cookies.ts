import { NextResponse } from 'next/server'

export function copySetCookies(source: NextResponse, target: NextResponse) {
  const setCookies = source.headers.getSetCookie?.() || []
  setCookies.forEach((cookie) => {
    target.headers.append('Set-Cookie', cookie)
  })
}
