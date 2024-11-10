import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {

        const { username, email, password } = await request.json()
        const existingUserVerifiedByUsername = await userModel.findOne({
            email: email,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username Is Already Taken"
                },
                {
                    status: 400
                }
            )
        }

        const existingUserByEmail = await userModel.findOne({ email: email })
        const verifyCode = Math.floor(1000000 + Math.random() * 900000).toString()


        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "Email Is Already Taken"
                    },
                    {
                        status: 400
                    }
                )
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new userModel({
                username,
                email: email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            })
            await newUser.save()
        }

        console.log(email, username, verifyCode);
        
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: 'Email sending failed for verification : ' + emailResponse.message
            }, {
                status: 500
            })
        }

        return Response.json({
            success: true,
            message: 'User Registered Successfully. Please check your email for verification code '

        }, {
            status: 201
        })

    } catch (error) {
        console.error("Error registering user !! : ", error)
        return Response.json({
            success: false,
            message: "Error registering user !!"
        },
            {
                status: 500
            })
    }
}