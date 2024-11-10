import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: Request) {
    const url = new URL(request.url);
    const messageid = url.pathname.split("/").pop()
    console.log(`REQUEST FROM DELETE MESSAGE ====>>> ${messageid}`)
    console.log(`\n\nMessage Id from route delete-message : ${messageid}`);
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    if (!user) {
        return new Response(JSON.stringify({
            success: false,
            message: "User Not Authenticated",
        }), { status: 401 });
    }

    try {
        const updatedResult = await userModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageid } } }
        );

        if (updatedResult.modifiedCount === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: "Message not found or already deleted",
            }), { status: 404 });
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Message deleted successfully",
        }), { status: 200 });

    } catch (error) {
        console.log("Error in delete message route", error);

        return new Response(JSON.stringify({
            success: false,
            message: "Error deleting message",
        }), { status: 500 });
    }
}
