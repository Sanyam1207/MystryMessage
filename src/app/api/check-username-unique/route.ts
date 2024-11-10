import userModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { z } from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = searchParams.get("username")
        console.log("Query params  ==== ", queryParam)

        //validate with zod

        const result = usernameQuerySchema.safeParse({username : queryParam})
        console.log("Zod Results : ", result)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            console.log("username error : ", usernameErrors)
            return Response.json({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid query Parameters",
            },
                {
                    status: 400,
                })
        }

        const { username } = result.data;
        const existingVerifiedUser = await userModel.findOne({username : username, isVerified: true})

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message : "Username Already Taken"
            })
        }

        return Response.json({
            success: true,
            message : "Username Is Available"
        })

    } catch (error) {
        console.error("Error checking username : ", error);
        return Response.json({
            success: false,
            message: "Error checking username",
        },
            {
                status: 500,
            })
    }
}