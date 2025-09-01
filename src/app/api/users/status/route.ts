
export async function GET() {
  // check session/cookie/token
  const loggedIn = true; // <-- check DB or JWT validity
  return Response.json({ loggedIn });
}
