import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('token');

    // Protecting all routes except for login and public routes
    if (!token && !request.nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/hospital/:path*', '/patient/:path*','/radiographer/:path*','/physician/:path*'], // Apply middleware to these paths
};
