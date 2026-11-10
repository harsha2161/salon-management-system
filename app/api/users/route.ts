import prisma from "@/lib/prisma";
import { userAdminUpdateSchema } from "@/types/dto/userAdminUpdateRequest";
import { userRegistrationRequestSchema } from "@/types/dto/userRegistrationRequests";
import { userSelfUpdateSchema } from "@/types/dto/userSelfUpdateRequest";
import { GetUser, isPrivileges } from "@/utils/authentication";
import PageInfoRetrieval from "@/utils/pageInfoRetrieval";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

//get users
export async function GET(request : NextRequest){

    const user = await GetUser(request)
    const params = PageInfoRetrieval(request)

    if(user == null){
        return NextResponse.json({
            message : "you are not login or your login session is expired"
        })
    }
    const havePrivileges = await isPrivileges(user , "users:read")

    if(!havePrivileges){
        return NextResponse.json({
            message : "you are not authorized to access this resource"
        },
        {
            status : 403
        }
    )
    }

    const userCount = await prisma.user.count()
    const totlePages = Math.ceil(userCount / params.pageSize)

    if(params.pageNumber > totlePages) {
        return NextResponse.json({
            message : "page number is out of range"
        })
    }

    const users = await prisma.user.findMany({
        skip : (params.pageNumber - 1 ) * params.pageSize,
        take : params.pageSize,
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
            users : users,
            pagination : {
                pageNumber : params.pageNumber,
                pageSize : params.pageSize,
                totlePages : totlePages,
                totle : userCount,
            }
        }
    )
}
// user register
export async function POST(request : NextRequest){

    const body = await request.json()

    try{
        // validate the request body using zod schema
        const parseBody = userRegistrationRequestSchema.parse(body) 
        
        // check if user already exist
        const existingUser = await prisma.user.findUnique({
            where : {
                email : body.email
                //email : parseBody.email
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
        // create new user
        await prisma.user.create({
            data : {
                firstName : body.firstName,
                lastName : body.lastName,
                email : body.email,
                password : await bcrypt.hash(body.password, 12)
            }
        })
            return NextResponse.json(
                {
                    message : "user created successfully",
                },
                {
                    status : 201
                }
            )

        }catch(error){

            if(error instanceof z.ZodError){
                return NextResponse.json(
                    {
                        message : error.issues[0]?.message || "invalid inputs",
                    },
                    {
                        status : 500
                    }
                )
            }
                return NextResponse.json(
                    {
                        message : "invalid inputs",
                        error : error
                    },
                    {
                        status : 500
                    }
                )
            }
    
}

// user update
export async function PUT(request : NextRequest){

    const userId = request.nextUrl.searchParams.get("id")
    const body = await request.json()

    try{
          
        const user = await prisma.user.findUnique({
            where : {
                id : userId || "0000"
            }
        })

        if(user == null){
            return NextResponse.json(
                {
                    message : "you are not login or your login session is expired"
                },
                {
                    status : 403
                }
            )
        }

        if(userId == user.id){

            userSelfUpdateSchema.parse(body)
    
            await prisma.user.update({
                where : {
                    id : userId || ""
                },
                data : {
                    firstName : body.firstName || user.firstName,
                    lastName : body.lastName || user.lastName,
                    number : body.number || user.number,
                    profileImage : body.profileImage || user.profileImage,   
                }
            })

            return NextResponse.json(
                {
                    message : "user update successfull"
                },
                {
                    status : 200
                }
            )
           
        } else {

            const hasPrivilages = await isPrivileges(body , "users:edite")

            if(!hasPrivilages){

                return NextResponse.json(
                    {
                        message : "you can not edite others user detials",
                    },
                    {
                        status : 401
                    }
                )

            } else {

                userAdminUpdateSchema.parse(body)

                await prisma.user.update({
                    where : {
                        id : userId || ""
                    },
                    data : {
                        firstName : body.firstName || user.firstName,
                        lastName : body.lastName || user.lastName,
                        number : body.number || user.number,
                        profileImage : body.profileImage || user.profileImage,
                        role : body.role || user.role,
                        status : body.status || user.status,
                        privileges : body.privileges || user.privilages,
                    }
                })

                return NextResponse.json(
                    {
                        message : "user update is successfull"
                    },
                    {
                        status : 200
                    }
                )
                
            }
        }

         }catch(error){

            if(error instanceof z.ZodError){
                return NextResponse.json(
                    {
                        message : error.issues[0]?.message || "invalid inputs",
                    },
                    {
                        status : 200
                    }
                )
            } 
            return NextResponse.json(
                {
                    message : "Server error",
                    error : error
                },
                {
                    status : 500
                }
            )         
        }
}

   

    
