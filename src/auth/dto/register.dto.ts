import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email().trim(),
  password: z.string(),
  name: z.string().trim(),
  accountName: z.string().trim(),
  username: z.string().trim().regex(/\S/),
})

export type RegisterInput = z.infer<typeof registerSchema>
