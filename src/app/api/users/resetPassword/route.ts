import { NextResponse,NextRequest } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connect();

export async function POST(request: NextRequest) {
    try{
        const reqBody = await request.json();
        // const {token,password} = reqBody;
      
        let token: string;
        let password: string;

        //extract token
        if (typeof reqBody.token === 'string') {
            token = reqBody.token;

        } else {
            return NextResponse.json({error: "Invalid token format"}, {status: 400});
        }
        //extract password
        if (typeof reqBody.password === 'string') {
            password = reqBody.password;
        } else if (reqBody.password && typeof reqBody.password.password === 'string'){
            password = reqBody.password.password;
        } 
        
        else {
            return NextResponse.json({error: "Invalid password format"}, {status: 400});
        }
        
        // console.log("Extracted Token:", token, 'Password:', password);
        

        // if(!token || !password || !confirmPassword) {
        //     return NextResponse.json({
        //         error: "Please provide all fields"
        //     }, {status: 400});
        // }
        // if(password !== confirmPassword) {
        //     return NextResponse.json({
        //         error: "Passwords do not match"
        //     }, {status: 400});
        // }
        // if(password.length < 6) {
        //     return NextResponse.json({
        //         error: "Password must be at least 6 characters long"
        //     }, {status: 400});
        // }
        
        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: {$gt: Date.now()},
            // password: {$ne: password}
        });

        const isSamePassword = await bcryptjs.compare(password, user.password);
            if (isSamePassword) {
                return NextResponse.json({
                    error: "New password must be different from the old password"
                }, {status: 400});
            }

        console.log("User found:", user);

        if (!user) {
            return NextResponse.json({
                error: "Token is invalid or expired"
            }, {status: 400});
        }

      
        const salt= await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        const tokenData = {
            id: user.id,
            password: user.password
        }
        //create token
        const newtoken = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"});
        console.log("New token generated:", token);

       const response =  NextResponse.json({
            message: "Password reset successfully",
            success: true
        });
        response.cookies.set("token", newtoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            // maxAge: 24 * 60 * 60 // 1 day in seconds
        })
        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in POST /api/users/resetPassword:", error);
            return NextResponse.json({error: error.message}, {status: 500});
        }
        return NextResponse.json
        ({
            error: "Unexpected error occurred"
        },
         {status: 500});
    }
}