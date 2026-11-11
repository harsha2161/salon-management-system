import { ProductStatus } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { productsCreationSchama } from "@/types/dto/productsCreationRequest";
import { productsUpdateSchama } from "@/types/dto/productUpdateRequest";
import { GetUser, isPrivileges } from "@/utils/authentication";
import PageInfoRetrieval from "@/utils/pageInfoRetrieval";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";


export async function POST(request : NextRequest){
    try{
        
        const user = await GetUser(request)
        const havePrivilage = await isPrivileges(user , "products:add")

        if(havePrivilage){ //authorization part

            const body = await request.json()
            const parseBody = productsCreationSchama.parse(body)

            await prisma.product.create(
                {
                    data : {
                       sku : parseBody.sku,
                       name : parseBody.name,
                       altName : parseBody.altName,
                       discription : parseBody.discription,
                       stock : parseBody.stock,
                       price : parseBody.price,
                       compareAt : parseBody.compareAt,
                       model : parseBody.model,
                       brand : parseBody.brand,
                       media : {
                        create : parseBody.media
                       }
                    }
                }
            )

            return NextResponse.json(
                {
                    message : "product added successfull"
                },
                {
                    status : 200
                }
            )


        
        } else {
            return NextResponse.json(
                {
                    message : "you have not privilages for add products"
                },
                {
                    status : 403
                }
            )
        }
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
            } else {
                console.log(error)
                return NextResponse.json(
                    {
                        message : "internal server error"
                    },
                    {
                        status : 500
                    }
                )
            }
        }
}

export async function GET(request : NextRequest){
    
    const user = await GetUser(request)
    const params = PageInfoRetrieval(request)

    const hasPrivilage = await isPrivileges(user , "products:view")

    // fetch all products without delete status(for having privilage users)
    if(hasPrivilage){
        const totalProduct = await prisma.product.count(
            {
                where : {
                    NOT : {
                         status : ProductStatus.DELETED,
                    },
                   
                }
            }
        )

        const totalPages = Math.ceil( totalProduct / params.pageSize)

        const products = await prisma.product.findMany({
            skip : (params.pageNumber - 1 ) * params.pageSize,
            take : params.pageSize,
            include : {
                media : true
            }
        })

      return NextResponse.json(
        {
            message : "products fetch is successfull",
            product : products,
            pagination : {
                pageNumber : params.pageNumber,
                pageSize : params.pageSize,
                totalPage : totalPages,
                totalCount : totalProduct
            }
        }
    )
    // fetch available products for all users
    } else {
        const totalProduct = await prisma.product.count(
            {
                where : {
                    status : ProductStatus.AVAILABLE
                }
            }
        )
        
        const totalPages = Math.ceil( totalProduct / params.pageSize)

        const products = await prisma.product.findMany(
            {
                where : {
                    status : ProductStatus.AVAILABLE
                }
            }
        )
           return NextResponse.json({

            message : "products fetch is successfull",
            product : products,
            pagination : {
                pageNumber : params.pageNumber,
                pageSize : params.pageSize,
                totalPage : totalPages,
                totalCount : totalProduct
            }
        }
    )
    }
}

export async function DELETE(request : NextRequest){

    const user = await GetUser(request)
    const hasPrivilage = await isPrivileges(user , "products:delete")
    
        if(!hasPrivilage){
            return NextResponse.json({ message : "use have not privilage for delete product"},{status : 403})
        }
       
        const id = request.nextUrl.searchParams.get("id")
        if(id === null){
            return NextResponse.json({message : "product is required"}, {status : 400})
        }

    try{

        const existingProduct = await prisma.product.findUnique({
            where : {
                id : id
            }
        })

        if(existingProduct == null){
            
              return NextResponse.json({message : "product is not found"}, {status : 404})
        }

        await prisma.product.update(
            {
                where : {
                    id : id
                },
                data : {
                    status : ProductStatus.DELETED
                }
            }
        )

        return NextResponse.json(
            {
                message : "products is deleted"
            },
            {
                status : 201
            }
        )
   
    } catch(error){
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

        return NextResponse.json({ message : "server error", error : error},{status : 500})
           
    }
}

export async function PUT(request : NextRequest){
    
    const user = await GetUser(request)
    const body = await request.json()
    const hasPrivilage = await isPrivileges(user , "product:edite")
    
        if(!hasPrivilage){
            return NextResponse.json({ message : "use have not privilage for edite product"},{status : 403})
        }
       
        const id = request.nextUrl.searchParams.get("id")
        if(id === null){
            return NextResponse.json({message : "product ID is required"}, {status : 400})
        }

    try{
         
        const parseBody = productsUpdateSchama.parse(body)
        const existingProduct = await prisma.product.findUnique({
            where : {
                id : id
            }
        })

        if(existingProduct == null){
              return NextResponse.json({message : "product is not found"}, {status : 404})
        }

        await prisma.product.update(
            {
                where : {
                    id : id
                },
                data : {
                    sky : parseBody.sku || existingProduct.sku,
                    name : parseBody.name || existingProduct.name,
                    altName : parseBody.altName || existingProduct.altName,
                    discription : parseBody.discription || existingProduct.discription,
                    stock : parseBody.stock || existingProduct.stock,
                    status : parseBody.status || existingProduct.status,
                    price : parseBody.price || existingProduct.price,
                    compareAt : parseBody.compareAt || existingProduct.compareAt,
                    model : parseBody.model || existingProduct.model,

                }
            }
        )

        if(parseBody.media != null && parseBody.media.length > 0){

            await prisma.media.deleteMany({
                where : {
                    productId : id
                }
            })

            await prisma.media.update({
                where : {
                    id : id
                },
                data : {
                    create : parseBody.media
                }
            })
        }
   
    } catch(error){

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

        return NextResponse.json({ message : "server error", error : error},{status : 500})
    }        
}
