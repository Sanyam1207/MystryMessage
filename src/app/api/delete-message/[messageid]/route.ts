import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const { messageid } = await params
    console.log(`\n\nMessage Id from route delete-message : ${messageid}`)
    await dbConnect()

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    console.log(`Session : ${user._id}`);

    if (!user) {
        return Response.json({
            success: false,
            message: "User Not Authenticated",
        },
            {
                status: 401,
            })
    }

    try {
        const message = await userModel.findOne({})
        const updatedResult = await userModel.updateOne({
            _id: user._id
        }, {
            $pull: {
                messages: { _id: messageid }
            }
        })

        if (updatedResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted",
            },
                {
                    status: 404,
                })
        }

        return Response.json({
            success: true,
            message: "Message Delete Successfuly",
        },
            {
                status: 200,
            })
    } catch (error) {
        console.log("Error in delete message route", error);
        
        return Response.json({
            success: false,
            message: "Error deleting message",
        },
            {
                status: 500,
            })
    }


}