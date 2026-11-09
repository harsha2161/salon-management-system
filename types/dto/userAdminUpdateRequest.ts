import z from "zod";

const userAdminUpdateSchema = z.object({
    
    id : z.never().optional(),
    email : z.never().optional(),
    firstName : z.string().min(3).max(50).optional(),
    lastName : z.string().min(3).max(50).optional(),
    password : z.never().optional(),
    profileImgage : z.string().optional(),
    phoneNumber : z.string().max(13).optional(),
    role : z.never().optional(),
    status : z.never().optional(),
    privileges : z.never().optional(),
})

export type UserUpdateRequest = z.infer<typeof userAdminUpdateSchema>

export {userAdminUpdateSchema}