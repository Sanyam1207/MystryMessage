import userModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json()

    try {
        const user = await userModel.findOne({ username })

        if (!user) {
            return Response.json({
                success: false,
                message: "Username Not Found",
            },
                {
                    status: 404,
                })
        }

        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not Accepting the Messages",
            },
                {
                    status: 200,
                })
        }

        if (user.isAcceptingMessage !== true) {
            return Response.json({
                success: false ,
                message: "User is not Accepting the Messages -- 2",
            },
                {
                    status: 200,
                })
          }

        const newMessage = {
            content: content,
            createdAt: new Date()
        }

        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success: true,
            message: "Message sent successfully",
        },
            {
                status: 200,
            })

    } catch (error) {
        console.log("Error sending messages : ", error);
        
        return Response.json({
            success: false,
            message: "Internal server error ",
        },
            {
                status: 500,
            })
    }
}