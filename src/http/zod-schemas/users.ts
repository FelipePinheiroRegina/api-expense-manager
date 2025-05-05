import { z } from 'zod'

// SCHEMA TO REGISTER A USER -----
export const userRegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})
export type UserRegisterSchema = z.infer<typeof userRegisterSchema>

// SCHEMA TO CREATE A SESSION WITH METHOD TRADITIONAL -----
export const userSessionsTraditionalSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
export type UserSessionsTraditionalSchema = z.infer<
  typeof userSessionsTraditionalSchema
>
