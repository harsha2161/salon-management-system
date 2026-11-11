import prisma from "@/lib/prisma";
import { GetUser, isPrivileges } from "@/utils/authentication";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest){

    const id = request.nextUrl.searchParams.get("id")
    const user = await GetUser(request)
    const hasPrivilage = isPrivileges(user , "product:view")

    if(id == null){
        return NextResponse.json({message : "product is is not found"},{status : 404})
    }

    try{
        const product = await prisma.product.findUnique(
            {
                where : {
                    id : id
                },
                include : {
                    media : true
                }
            },   
        )
        
        if(product?.status == "DELETED"){
            return NextResponse.json({message : "product is is not found"},{status : 404})   
        }

        if(product?.status == "UNAVAILABLE"){

            if(!hasPrivilage)
                return NextResponse.json({message : "product is is not found"},{status : 404}) 

            } else {
                return NextResponse.json({message : "product fetch is successfull" , product : product},{status : 200})
        }

    return NextResponse.json({message : "product fetch is successfull" , product : product},{status : 200})
    
    } catch(error){

        return NextResponse.json({message : "internal server error"},{status : 500})
    }
}