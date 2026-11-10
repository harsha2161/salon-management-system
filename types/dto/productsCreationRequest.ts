import z from "zod";
import { userAdminUpdateSchema } from "./userAdminUpdateRequest";

const ProductStatusEnum = z.enum([ "AVAILABLE" ,  "UNAVAILABLE" , "DELETED"])
const MediaTypesEnum = z.enum([ "IMAGE" , "VIDEO"])

const productsCreationSchama = z.object({
    sku : z.string().max(50),
    name : z.string().max(50),
    altName : z.array(z.string().max(200)).optional().default([]),
    discription : z.string().min(10),
    stock : z.number().int().min(0),
    status : ProductStatusEnum.optional().default("AVAILABLE"),
    price : z.number().min(0),
    compareAt : z.number().min(0),
    model : z.string().max(100).optional(),
    brand : z.string().max(100).optional(),
    media : z.array(
        z.object({
            url : z.url(),
            type : MediaTypesEnum
        }) 
    )
})

export type ProductsCreateRequest = z.infer<typeof productsCreationSchama>
export {productsCreationSchama}