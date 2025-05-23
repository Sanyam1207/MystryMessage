'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form"
import * as z from "zod"

const Page = () => {

    const { toast } = useToast()
    const router = useRouter()

        const form = useForm<z.infer<typeof signInSchema>>({
            resolver: zodResolver(signInSchema),
            defaultValues: {
                identifier: '',
                password: ''
            }
        })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
          redirect: false,
          identifier: data.identifier,
          password: data.password
        })

        if (result?.error) {
          toast({
            title: 'Login Failed',
            description: "Incorrect Username or Password",
            variant: 'destructive'
          })
        }

        if (result?.url) {
          router.replace("/dashboard")
        console.log("Loginn success");
        
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join True Feedback
                    </h1>
                    <p className="mb-4">Sign in to continue your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                    <Input {...field} name="email" placeholder='email/username'/>
                                    </FormControl>
                                    <p className='text-muted text-gray-600 text-sm'>We will send you a verification code</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                    <Input type="password" {...field} name="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full'>
                            Sign In
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        New To Feedbacks?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}


export default Page