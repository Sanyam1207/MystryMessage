import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export async function GET(request: Request, {params}: {params : {username : string}}) {

    try {
        dbConnect()
        const { username } = await params
        console.log(`\n\nUsername ${username}\n\n`)

        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json({
                success: false,
                message: "User Does Not Exist",
            },
                {
                    status: 404,
                })
        }

        if (user.isAcceptingMessage === false) {
            return Response.json({
                success: false,
                message: "User Is Not Currently Accepting Messages",
            },
                {
                    status: 200,
                })
        }
    }

    catch (error) {
        return Response.json({
            success: false,
            message: `Some Internal Errors Occured In Checking Message Status ${error}`,
        },
            {
                status: 500,
            })
    }

}
