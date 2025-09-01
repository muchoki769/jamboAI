import {connect} from '@/dbConfig/dbConfig';
import {NextRequest, NextResponse} from "next/server";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {token} = reqBody;
    console.log(token);

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: {$gt: Date.now()} //greater than current time
    });
    if (!user) {
      return NextResponse.json({error: "Invalid or expired token"},
          {status: 400})
    }

    console.log(user);

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true
    })
    
  } catch(error:unknown) {
    if (error instanceof Error) {
      console.error("Error in POST /api/users/verifyemail:", error);
      return NextResponse.json({error: error.message},
          {status: 500})
    }
    return NextResponse.json({error: "Unexpected error occurred"},
        {status: 500})
  }
}