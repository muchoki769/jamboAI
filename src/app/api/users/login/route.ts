import {connect} from '@/dbConfig/dbConfig';
import {NextRequest,NextResponse} from "next/server";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/userModel';


connect();

export async function POST(request: NextRequest) {
    try{
        const reqBody = await request.json();
        const {email, password} = reqBody;
        console.log(reqBody);

        //check if user exists
        const user = await User.findOne({email})
        if(!user) {
            return NextResponse.json({error: "User not found"},
                {status: 404})
        }
        console.log("user exists");
        //check if passsword is correct
        const validPassword = await bcryptjs.compare (password, user.password)
        if(!validPassword) {
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        console.log(user);

        //create token data -token should not be stored in local storage insted of that use cookies
        const tokenData={
            id: user._id,
            username: user.username,
            email: user.email

        }
        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})
         console.log(token);
        const response = NextResponse.json({
            message: "Login Succesfully",
            success: true,
        })

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            
        })
        return response;
    }
    catch(error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({error: error.message},
                {status: 500})
        }
        console.error("Error in POST /api/users/login:", error);
        return NextResponse.json({error: "Unexpected error occurred"},
            {status: 500})
        
    }
}