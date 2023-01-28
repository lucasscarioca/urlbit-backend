import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string(),
})

export type LoginInput = z.infer<typeof loginSchema>
