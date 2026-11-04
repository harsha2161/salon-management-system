import prisma from "@/lib/prisma";
import { GetUser, isPrivileges } from "@/utils/authentication";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

//get users
export async function GET(request : NextRequest){

    const requestUser = await GetUser(request)

    if(requestUser == null){
        return NextResponse.json({
            message : "you are not login or your login session is expired"
        })
    }
   const havePrivileges = await isPrivileges(requestUser , "users:read")

    if(havePrivileges){
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
            privilages : true,
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
// user register
export async function POST(request : NextRequest){

    const requestUser = await request.json()

    if(requestUser == null){
        return NextResponse.json({
            message : "you are not login or your login session is expired"
        })
    }

    const existingUser = await prisma.user.findUnique({
        where : {
            email : requestUser.email
        }
    })

    if(existingUser != null){
        return NextResponse.json({
            message : "user already exist"
        },
        {
            status : 409
        })
    }

    await prisma.user.create({
        data : {
            firstName : requestUser.firstName,
            lastName : requestUser.lastName,
            email : requestUser.email,
            password : await bcrypt.hash(requestUser.password, 12)
        }
    })
        return NextResponse.json(
            {
            message : "user created successfully"
            },
            {
                status : 201
            }
        )
}
export async function PUT(request : NextRequest){

    const id = request.nextUrl.searchParams.get("id")
   
    const RequestedUser = await GetUser(request)

    if(RequestedUser == null){
        return NextResponse.json(
            {
                message : "you are not login or your login session is expired"
            }
        )
    }

    if(RequestedUser.id != id){
        return NextResponse.json({
            message : "only edit own account"
        })
    }



      
  
}


