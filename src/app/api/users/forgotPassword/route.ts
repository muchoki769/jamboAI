import {connect} from '@/dbConfig/dbConfig';
import {NextRequest, NextResponse} from "next/server";
import User from "@/models/userModel";
import { sendEmail } from '@/helpers/mailer';


connect();

export async  function POST(request: NextRequest) {
    try{
        const reqBody = await request.json();
        const {token,email} = reqBody;
        console.log(reqBody);

        const user = await User.findOne({
         verifyToken: token,
        //  verifyTokenExpiry: {$gt: Date.now()}, //greater than current time
        //  password: {$ne: password} // check if password is not same as old password
         email
        //  forgotPasswordToken: token,
        //  forgotPasswordTokenExpiry: {$gt: Date.now()},

        });
        if (!user) {
            return NextResponse.json({error: "User Not found"},
                {status: 404})
          }
          console.log(user);

          await sendEmail({
            email,
            emailType: "RESET",
            userId:user._id
          })


        //   const token  = crypto.randomBytes(32).toString('hex');
        //   const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
          

          // user.forgotPasswordToken = token;
          // user.forgotPasswordToken = undefined;
          // user.forgotPasswordTokenExpiry = undefined; // 1 hour from now
          // await user.save();


          // user.isVerified = true;
          // user.forgotPasswordToken = undefined;
          // user. forgotPasswordTokenExpiry= undefined;
          // await user.save();

          user.isVerified = true;
          user.verifyToken = undefined;
          user.verifyTokenExpiry = undefined;
          await user.save();

       


          return NextResponse.json({
            message: "Reset Email verified and sent  successfully",
            success: true
          })


    } catch (error: unknown){
      if (error instanceof Error) {
        return NextResponse.json({error: error.message}, {status: 500});
      }
        return NextResponse.json({error: "An unknown error occurred"},
            {status: 500}
        )
    }
}