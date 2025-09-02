
export async function GET() {
  // check session/cookie/token
  const loggedIn = true; // <-- check DB or JWT validity
  return Response.json({ loggedIn });
}
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export async function GET(req: Request) {
//   try {
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader) {
//       return NextResponse.json(
//         { authStatus: false, message: "No token provided" },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       return NextResponse.json(
//         { authStatus: false, message: "Invalid token format" },
//         { status: 401 }
//       );
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);

//     return NextResponse.json({ authStatus: true, user: decoded });
//   } catch (err) {
//     return NextResponse.json(
//       { authStatus: false, message: "Unauthorized" },
//       { status: 401 }
//     );
//   }
// }


// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const cookieStore = cookies();
//     const token = (await cookieStore).get("token")?.value;

//     if (!token) {
//       return NextResponse.json({ authStatus: false }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);

//     return NextResponse.json({ authStatus: true, user: decoded });
//   } catch {
//     return NextResponse.json({ authStatus: false }, { status: 401 });
//   }
// }

