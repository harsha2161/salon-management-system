import {z} from "zod";

const userRegistrationRequestSchema = z.object(
    {
       email : z.email(),
       firstName : z.string().max(50),
       lastName : z.string().max(50),
       password : z.string().min(6).max(100),
       phoneNumber : z.string().optional(),
       privilages : z.never().optional()
     

    }
)

export type UserRegistrationRequest = z.infer<typeof userRegistrationRequestSchema>

export {userRegistrationRequestSchema}