import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {

        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystry Message | Verification Code',
            react: VerificationEmail({ username : username, otp: verifyCode }),
        });

        if (error) {
            return { success: false, message: "Failed to send verification email" }
        }

        console.log(data)
        return { success: true, message: 'Verification Email Sent Successfully' }

    } catch (emailError) {

        console.error("Error sending verification Email : ", emailError)
        return { success: false, message: "Failed to send verification email" }
    }
}