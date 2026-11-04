import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"
import { RequestUserType } from "@/types/request";

export async function GetUser(request : NextRequest) : Promise<RequestUserType | null> {
    
    const loginToken = request.cookies.get("login-token")?.value
    const secret = new TextEncoder().encode(process.env.jWT_KEY)
    
    try{
        const tokenData = await jose.jwtVerify(
            loginToken || "",
            secret
        )
        const user = tokenData.payload as unknown  as RequestUserType

        return user

    }catch{

        return null
    }
}

export async function isPrivileges (request : NextRequest , requiredPrivileges : string) : Promise<boolean | null> {
    
    const user : RequestUserType | null = await GetUser(request)

    if(user == null){
        return null
    }

    if(user.privileges.includes(requiredPrivileges)){
        return true
    }else{
        return false
    }

}