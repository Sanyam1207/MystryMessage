'use client'
import { MessageCard } from '@/components/MessageCard'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Message, User } from '@/model/User'
import { acceptMessagesSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const Page = () => {

    const router = useRouter()

    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const { toast } = useToast()

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessagesSchema),
    })

    const { register, watch, setValue } = form

    const acceptMessages = watch("acceptMessages")

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>("/api/accept-message")
            setValue("acceptMessages", response.data.isAcceptingMessages)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Failed to fetch message settings"
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(false)
        setIsSwitchLoading(false)

        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if (refresh) {
                toast({
                    title: 'Refreshed Messages',
                    description: "Showing Latest Messages"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Failed to fetch message settings"
            })
        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setIsLoading, setMessages])

    useEffect(() => {
        if (!session || !session.user) {
            return
        }
        fetchMessages()
        fetchAcceptMessage()
    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>("/api/accept-message", {
                acceptMessages: !acceptMessages
            })
            setValue("acceptMessages", !acceptMessages)
            toast({
                title: response.data.message,
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Failed to fetch message settings"
            })
        }
    }

    const sessionData = session?.user as User
    console.log("Session data : +> +> : ", { ...sessionData });
    const { username } = { ...sessionData }
    console.log("Session data : +> +> : ", username);

    const isBrowser = typeof window !== 'undefined';
    const baseUrl = isBrowser ? `${window.location.protocol}//${window.location.host}` : '';
    const profileUrl = username ? `${baseUrl}/u/${username}` : '';

    const copyToClipboard = () => {
        if (isBrowser) {
            navigator.clipboard.writeText(profileUrl);
            toast({
                title: "Url Copied",
                description: "Profile Url has been copied to clipboard"
            });
        }
        router.replace(profileUrl)
    };

    if (!session || !session.user) {
        return <div> Please Login</div>
    }

    return (<>
        <Navbar />
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={index}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    </>
    );
}


export default Page