"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/zod";
import { loginAction } from "@/app/actions/auth/login-action";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const SignInForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      const response = await loginAction(values);
      toast({
        title: "Inicio de sesión",
        description: "Inicio de sesión exitoso",
        variant: "success",
      });
      console.log(response);
      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
        setError(response.error);
      } else {
        router.push("/dashboard/home");
      }
    });
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='max-w-md w-full p-4 border border-gray-300 rounded-md'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl className='relative'>
                  <div className='relative flex items-center'>
                    <Input
                      type='email'
                      placeholder='email@example.com'
                      {...field}
                      className='pr-10'
                    />
                    <Mail className='absolute right-3 text-gray-400' />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <FormMessage>{error}</FormMessage>}

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl className='relative'>
                  <div className='relative flex items-center'>
                    <Input
                      type='password'
                      placeholder='Ingresa tu contraseña'
                      {...field}
                      className='pr-10'
                    />
                    <LockKeyhole className='absolute right-3 text-gray-400 ' />{" "}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='mb-5 mt-4'>
            <Button
              type='submit'
              value='Iniciar sesion'
              className='w-full '
              variant={"success"}
              disabled={isPending}
            >
              Iniciar sesión
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
