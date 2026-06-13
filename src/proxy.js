import { NextResponse } from 'next/server';

export function proxy(request) {
  // Grab the authentication token from your cookies
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('user_role')?.value; // Best practice: store role in cookies on login

  const url = request.nextUrl.clone();

  // 1. If someone tries to access /manager paths without being logged in
  if (!token) {
    url.pathname = '/'; // Redirect target
    return NextResponse.redirect(url);
  }

  // 2. If they are logged in but do not have the required "manager" permission role
  if (userRole !== 'manager') {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // 3. Authorized! Let them pass through natively
  return NextResponse.next();
}

// 🎯 CRUCIAL CONFIG: Tells Next.js to ONLY run this security script on your manager routes
export const config = {
  matcher: ['/manager/:path*'],
};
