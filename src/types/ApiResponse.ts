import { Message } from "@/model/User"

export interface ApiResponse {
    success: boolean,
    message: string,
    data?: string,
    isAcceptingMessages?: boolean,
    messages?: Array<Message>,
    
}