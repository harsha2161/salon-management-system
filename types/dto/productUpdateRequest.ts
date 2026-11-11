import z from "zod";
import { userAdminUpdateSchema } from "./userAdminUpdateRequest";

const ProductStatusEnum = z.enum([ "AVAILABLE" ,  "UNAVAILABLE" , "DELETED"])
const MediaTypesEnum = z.enum([ "IMAGE" , "VIDEO"])

const productsUpdateSchama = z.object({
    sku : z.string().max(50).optional(),
    name : z.string().max(50).optional(),
    altName : z.array(z.string().max(200)).optional(),
    discription : z.string().min(10).optional(),
    stock : z.number().int().min(0).optional(),
    status : ProductStatusEnum.optional().optional(),
    price : z.number().min(0).optional(),
    compareAt : z.number().min(0).optional(),
    model : z.string().max(100).optional(),
    brand : z.string().max(100).optional(),
    media : z.array(
        z.object({
            url : z.url(),
            type : MediaTypesEnum
        }) 
    ).optional()
})

export type ProductsUpdateRequest = z.infer<typeof productsUpdateSchama>
export {productsUpdateSchama}