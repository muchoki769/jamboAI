import z from "zod";

export const UserFormValidation = z.object({
     username:z
     .string()
     .min(1, {message:"Name must be at least 2 characters long"})
     .max(6,{message: "Maximum 20 characters"})
     .trim(),
     email: z
     .string()
     .email({message:"Invalid email address"}),

     password: z
     .string()
     .min(8, {message:"Password must be at least 8 characters long"})
     .max(30,{message: "Maximum 30 characters"})
     .regex(/[A-Z]/,{message: "Password must contain at least one uppercase letter"})
     .regex(/[a-z]/, {message:"Password must contain at least one lowercase letter"})
     .regex(/\d/,{message: "Password must contain at least one number"})
     .regex(/[\W_]/,{message: "Password must contain atleast one special character"})
     .trim(),
})
export const LoginFormValidation = z.object ({
     email: z
     .string()
     .email({message:"Invalid email address"}),

     password: z
     .string()
     .min(8, {message:"Password must be at least 8 characters long"})
     .max(30,{message: "Maximum 30 characters"})
     .regex(/[A-Z]/,{message: "Password must contain at least one uppercase letter"})
     .regex(/[a-z]/, {message:"Password must contain at least one lowercase letter"})
     .regex(/\d/,{message: "Password must contain at least one number"})
     .regex(/[\W_]/,{message: "Password must contain atleast one special character"})
     .trim(),
})
export const ForgotPasswordFormValidation = z.object ({
     email: z
     .string()
     .email({message:"Invalid email address"}),

})
export const ResetPasswordFormValidation = z.object ({

     password: z
     .string()
     .min(8, {message:"Password must be at least 8 characters long"})
     .max(30,{message: "Maximum 30 characters"})
     .regex(/[A-Z]/,{message: "Password must contain at least one uppercase letter"})
     .regex(/[a-z]/, {message:"Password must contain at least one lowercase letter"})
     .regex(/\d/,{message: "Password must contain at least one number"})
     .regex(/[\W_]/,{message: "Password must contain atleast one special character"})
     .trim(),
})

export type UserFormValidationType = z.infer<typeof UserFormValidation>;
export type LoginFormValidationType = z.infer<typeof LoginFormValidation>;
export type ForgotPasswordFormValidationType = z.infer<typeof ForgotPasswordFormValidation>;
export type ResetPasswordFormValidationType = z.infer<typeof ResetPasswordFormValidation>;