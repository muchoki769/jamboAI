import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

type DecodedToken ={
    id: string;
    email?: string;
    exp?: number;
}

export const getDataFromToken = (request: NextRequest) => {
    try{
        const token = request.cookies.get("token")?.value || '';
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
        if(typeof decoded === "object" && decoded !== null && "id" in decoded) {
            const decodedToken = decoded as DecodedToken;
        return decodedToken.id;
        }
    } catch (error: unknown) {
        if(error instanceof Error) 
        throw new Error(error.message);
    }
}