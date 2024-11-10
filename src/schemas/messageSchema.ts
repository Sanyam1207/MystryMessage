import { z } from 'zod';

export const messageSchema = z.object({
    content: z.string().min(10, 'Content must be atleast of 10 charachters').max(600, 'Content Must be no longer than 600 charachter')
})