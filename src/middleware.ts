import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  
//   return NextResponse.redirect(new URL('/home', request.url))
   const path = request.nextUrl.pathname; 

   const isPublicPath = path === '/signIn' 
   || path === '/signUp'
     || path ==='/verifyemail' || path === '/forgotPassword'

   const token = request.cookies.get('token')?.value || ''

   if(isPublicPath && token) {
    return NextResponse.redirect(new URL('/JamboAI', request.nextUrl))
   }

   if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/signIn',  request.nextUrl))
   }
}
 
// See "Matching Paths" below to learn more
export const config = {
//   matcher: '/about/:path*',
    matcher:[
        '/JamboAI/:path',
        '/pay/:path*',
        
        // '/signup',
        // '/login',
        // '/forgotPassword',
        // '/resetPassword',
        // '/verifyemail',
    ]
}
// export const config = {
//     // matcher: ['/((?!api|_next/static|_next/image|.*\\.png$.*)'],
//     matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };