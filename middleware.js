// import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
// export function middleware(request) {
// console.log("pathname", request.nextUrl.pathname);
// console.log("request", request.cookies.get("dataUser"));
// const user = request.cookies.get("dataUser");
// const loggedIn = request.cookies.get("loggedIn");
// console.log(Boolean(user));
// const url = request.nextUrl.clone();
// if (url.pathname === "/") {
//   if (!user) {
//     return NextResponse.rewrite(new URL("login", request.url));
//   } else {
//     return NextResponse.rewrite(new URL("/", request.url));
//   }
// }
// if (
//   url.pathname.startsWith("/login") ||
//   url.pathname.startsWith("/register")
// ) {
//   if (user) {
//     return NextResponse.rewrite(new URL("/", request.url));
//   }
// }
// if (url.pathname.startsWith("/category")) {
//   if (!user) {
//     console.log("category");
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }
// }
// if (url.pathname.startsWith("/playFilm")) {
//   if (!user) {
//     console.log("playFilm");
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }
// }
// if (url.pathname.startsWith("/user")) {
//   if (!user) {
//     console.log("playFilm");
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }
// }
// if (url.pathname.startsWith("/editInfo")) {
//   if (!user) {
//     console.log("playFilm");
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }
// }
// console.log("okk");
// return NextResponse.next();
// }

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/:path*",
// };
