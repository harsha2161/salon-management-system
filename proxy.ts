import { NextRequest, NextResponse } from "next/server";

const allowedMethods = "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS";

export default function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  // Browsers send OPTIONS before cross-origin requests using non-simple methods
  // or headers. Answer the preflight without invoking the API route.
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Access-Control-Allow-Methods", allowedMethods);
      
      // FIXED: Wrapped the floating string in the headers.set() method
      response.headers.set(
        "Access-Control-Allow-Headers", 
        request.headers.get("access-control-request-headers") ?? "Content-Type, Authorization"
      );
      
      response.headers.set("Access-Control-Max-Age", "86400");
      response.headers.set("Vary", "Origin");
    }
    return response;
  }

  const response = NextResponse.next();
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", allowedMethods);
    response.headers.set("Vary", "Origin");
  }
  return response;
}

export const config = {
  matcher: "/api/:path*",
};