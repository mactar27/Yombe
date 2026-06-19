import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const authCookie = req.cookies.get('auth_user')
  if (!authCookie) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
  try {
    const user = JSON.parse(authCookie.value)
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
