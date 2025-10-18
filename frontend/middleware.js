import { NextResponse } from 'next/server'

export function middleware(request) {
    const token = request.cookies.get('access_token')?.value || null
    const { pathname } = request.nextUrl

    // Daftar halaman publik
    const publicPaths = ['/login', '/register', '/_next', '/api']

    const isPublic = publicPaths.some(path => pathname.startsWith(path))

    // Jika belum login dan mencoba akses halaman private → redirect ke login
    if (!token && !isPublic) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Jika sudah login tapi buka login page → redirect ke dashboard
    if (token && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
