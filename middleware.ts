import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/authServer";

// List of paths that don't require authentication
// const publicPaths = ["/auth", "/"];

export async function middleware(request: NextRequest) {
  //   const session = await getSession();

  //   // Get the pathname of the request (e.g. /, /protected, /protected/123)
  //   const path = request.nextUrl.pathname;

  //   // If it's a public path, don't check for authentication
  //   if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
  //     return NextResponse.next();
  //   }

  //   // Check if the user is authenticated
  //   if (!session?.data?.user) {
  //     // Redirect to login page if accessing protected route while not authenticated
  //     const response = NextResponse.redirect(new URL("/auth", request.url));
  //     return response;
  //   }

  //   // If the user is accessing their own profile, allow it
  //   if (path.startsWith(`/${session.data.user.username}`)) {
  //     return NextResponse.next();
  //   }

  //   // For other profile pages, we'll allow viewing but might want to add additional checks
  //   if (path.match(/^\/[^/]+$/)) {
  //     return NextResponse.next();
  //   }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
