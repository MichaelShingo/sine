import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthed = !!req.auth;

  if (pathname.startsWith('/dashboard')) {
    if (!isAuthed) {
      const signInUrl = new URL('/api/auth/signin', req.nextUrl.origin);
      signInUrl.searchParams.set(
        'callbackUrl',
        `${pathname}${req.nextUrl.search}`,
      );
      return NextResponse.redirect(signInUrl);
    }
    return;
  }

  // if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
  //   if (!isAuthed) {
  //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  //   }
  // }
});

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};
