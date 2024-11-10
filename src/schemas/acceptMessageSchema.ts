import { boolean, z } from 'zod';

export const acceptMessagesSchema = z.object({
    acceptMessages: boolean()
})