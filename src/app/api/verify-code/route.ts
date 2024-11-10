import userModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { z } from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";

export async function POST(request: Request) {
    await dbConnect()

    try {

        //TODO : ZOD VERIFICATION
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username);
        const user = await userModel.findOne({ username: decodedUsername })

        if (!user) {
            console.error("User Not Found ");
            return Response.json({
                success: false,
                message: "User Not Found",
            },
                {
                    status: 500,
                })
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            console.log("User Verification successful");
            return Response.json({
                success: true,
                message: "User Verified Successfully",
            },
                {
                    status: 200,
                })
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code expired please signup again to get new code",

            },
                {
                    status: 400,
                })
        } else {
            return Response.json({
                success: false,
                message: "Incorrect Verification Code",
            },
                {
                    status: 400,
                })
        }

    } catch (error) {

        console.error("Error verifying user :  ", error);
        return Response.json({
            success: false,
            message: "Error verifying user",
        },
            {
                status: 500,
            })

    }
}