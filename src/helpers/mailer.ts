import nodemailer from 'nodemailer';
import User from '../models/userModel';
// import bcryptjs from 'bcryptjs';
import crypto from "crypto";


type SendEmailParams ={
   email: string;
   emailType: "VERIFY" | "RESET";
   userId: string;
};

export const sendEmail = async ({email,emailType,userId}:SendEmailParams) => {
   try{

        const rawToken = crypto.randomBytes(32).toString("hex");
        //create a hashed token
        // const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        //   const hashedToken = await bcryptjs.hash(rawToken, 10);  
       if (emailType === "VERIFY") {
        await User.findByIdAndUpdate(userId, 
            {
                verifyToken: rawToken,
                verifyTokenExpiry:Date.now() + 10800000  //3600000 // 1 hour
            },
          {new:true} //runValidators:true
        )
       } else if (emailType === "RESET") {
        await User.findByIdAndUpdate(userId, 
            {
                forgotPasswordToken: rawToken,
                forgotPasswordTokenExpiry:Date.now() + 3600000 // 1 hour
            },
          {new:true} //runValidators:true
        )
       }

       
       
       
     const  transport = nodemailer.createTransport({
        host: "live.smtp.mailtrap.io",
        port: 587,
        auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS 
        
        
        }
    });

    const mailOptions = {
        from:'"jamboAI"<no-reply@jasirisolutions.com>', //'"Demo App"<no-reply@demomailtrap.co>', 
        to: email,//"ndungudavidmuchoki@gmail.com",
        subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
        html: //${process.env.DOMAIN}/${emailType === "VERIFY" ? "verifyemail" : "resetPassword"}?token=${rawToken}&id=${userId}
        `<p>Click <a href="${process.env.DOMAIN}/${emailType === "VERIFY" ? "verifyemail" : "resetPassword"}?token=${rawToken}">
        here</a>
        to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
        </p>
        
        <p>
        or copy paste the link below in your browser:
        <br>${process.env.DOMAIN}/${emailType === "VERIFY" ? "verifyemail" : "resetPassword"}?token=${rawToken}
        </p>
        <p>This link is valid for 3 hour</p>
        <p>If you did not request this email, please ignore it.</p>
        <p>Thanks,</p>
        <p>Team Awesome</p>
        `
    }
     const mailresponse = await transport.sendMail
     (mailOptions);
     return mailresponse;
   } catch (error: unknown) {
    if(error instanceof Error) 
        throw new Error(error.message);
   }
}