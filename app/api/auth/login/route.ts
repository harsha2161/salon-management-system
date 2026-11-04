import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"
import { use } from "react";

export async function POST(request : NextRequest){
    const body = await request.json();

    if(body.email == null){
        return NextResponse.json({
            message : "email is not found"
        })
    }

    const user = await prisma.user.findFirst(
        {
                where : {
                    email : body.email
                }
        })

        if(user == null){
            return NextResponse.json(
                {
                message : "user is not found"
                },
                {
                    status : 400
                }
            )
        }

        if(user.status != "ACTIVE"){
            return NextResponse.json({
                message : "your account is not active"
            })
        }

        await prisma.user.update(
            {
                where : {
                    id : user.id
                },
                data : {
                    lastLogin :  new Date()
                }
              
            }
        )

        const isPasswordValid = await compare(body.password , user.password)
        if(isPasswordValid){
            const token = await new jose.SignJWT({
                firtName : user.firstName,
                lastName : user.lastName,
                email : user.email,
                role : user.role,
                privilages : user.privilages

                //admin tokens, loginloken, owner, audiance, refresh token
            }).setProtectedHeader({
                    alg : "HS256"
                }).sign(new TextEncoder().encode(process.env.JWT_KEY))

                const responce = NextResponse.json({
                    message : "login successfull",
                    role : user.role
                })

                responce.cookies.set(
                    {
                        name : "login-token",
                        value : token,
                        httpOnly : true, // only save to browser
                        secure : false, //recivede  with https 
                        sameSite : "lax", 
                        maxAge : 60 * 60 * 24 * 7
                    }
                )

                return responce


        }else{
            return NextResponse.json(
                {
                    message : "password invalid"
                },
                {
                    status : 403
                }   
        )

        }
    
}
