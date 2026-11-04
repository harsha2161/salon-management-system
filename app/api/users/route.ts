import prisma from "@/lib/prisma";
import { GetUser, isPrivileges } from "@/utils/authentication";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest){

    const requestUser = await GetUser(request)

    if(requestUser == null){
        return NextResponse.json({
            message : "you are not login or your login session is expired"
        })
    }
    
    if(!isPrivileges){
        return NextResponse.json({
            message : "you are not authorized to access this resource"
        },
        {
            status : 403
        }
    )
    }
    const users = await prisma.user.findMany({
        select : {
            id : true,
            firstName : true,
            lastName : true,
            email : true,
            role : true,
            status : true,
            password : false,
            number : true,
            lastLogin : true,
        }
    })
    
    return NextResponse.json(
        {
            message : "user fatch successfull",
            users : users
        }
    )
}