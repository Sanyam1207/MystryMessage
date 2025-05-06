'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { messageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';


const MessagePage = () => {

  const [messages, setMessages] = useState(`What's your favorite movie?||Do you have any pets?||What's your dream job?`);
  const [messageArray, setMessageArray] = useState(messages.split('||'));
  const [content, setContent] = useState('');
  const params = useParams<{ username: string }>();
  const { toast } = useToast()

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    }
  })

  const handleSuggestOnClick = (messages: string) => {
    form.setValue('content', messages)
  }

  const fetchSuggestedMessages = async (content: string) => {
    try {
      const response = await axios.post<ApiResponse>("/api/suggest-messages", { content });
      const { data } = response
      console.log(`\nResponse Data : ${JSON.stringify(data)}`)
      const message: string = data.data || data.message
      setMessages(message)
      setMessageArray(message.split(" || "))

    } catch (error) {
      console.error("Error in Suggesting Message : ", error)
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message ?? "Error In Sending Message"

      toast({
        title: "Failed To Suggest Message",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      console.log(params.username)
        
        // if(!user) return toast({
        //   title: "User Not Found",
        //   description: "User Not Found",
        // })

        // if (user.isAcceptingMessage === false) {
        //   return toast({
        //     title: "User is Not Accepting Messages",
        //     description: "The user you are trying to send a message to is not accepting messages",
        //   })
        // }
        const response = await axios.post<ApiResponse>("/api/send-message", {
        username: params.username,
        content: data.content
      })

      console.log(`\nResponse Dqta : ${response.data.success}`)

      
      if (response.data.success === false) {
        return toast({
          title: 'Message Failed to sent',
          description: response.data.message,
        })
      }
      

      toast({
        title: 'Message Sent Successfully',
        description: response.data.message
      })


    } catch (error) {
      
      const axiosError = error as AxiosError<ApiResponse>;
      

      // Check if the error is due to user not accepting messages (403)
      if (axiosError.response?.status === 403) {
        console.error("Error in Sending Message : ", axiosError);
        toast({
          title: "Message Not Accepted",
          description: "The user is currently not accepting messages.",
          variant: "destructive"
        });
      } else {
        const errorMessage = axiosError.response?.data.message ?? "Error In Sending Message";

        toast({
          title: "Failed Sending Message",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  }

  useEffect(() => {
    const subscription = form.watch((value) => {
      setContent(value.content || '');
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <div className='className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl'>
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Your Secret Message To : {params.username}</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Message Here" className='resize-none' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            Send It
          </Button>
        </form>
      </Form>


      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={() => { fetchSuggestedMessages(content) }}
            className="my-4"
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Suggested Messages</h3>
          </CardHeader>

          {messageArray.map((messages, index) => (
            <CardContent key={index} onClick={() => { handleSuggestOnClick(messages) }} className="flex flex-col space-y-4 cursor-pointer">
              {messages}
            </CardContent>
          ))}

        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>


    </div>
  )
}

export default MessagePage