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
import { LockKeyhole, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const SignInForm = () => {
  const [_error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null);
    startTransition(async () => {
      try {
        const response = await loginAction(values);

        if (response?.error) {
          setError(response.error);
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          });
        }
      } catch (_err) {
        // Los errores de redirección se ignoran aquí porque el navegador ya estará cambiando de página
      }
    });
  }

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='max-w-md w-full p-6 border border-border rounded-lg bg-card shadow-sm'
        >
          <div className='mb-6 text-center'>
            <h1 className='text-2xl font-bold'>Bienvenido</h1>
            <p className='text-sm text-muted-foreground'>SIRHM</p>
          </div>

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='mb-4'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className='relative flex items-center'>
                    <Input
                      placeholder='admin@uraccan.edu.ni'
                      {...field}
                      className='pr-10'
                    />
                    <Mail className='absolute right-3 h-4 w-4 text-muted-foreground' />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='mb-6'>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <div className='relative flex items-center'>
                    <Input
                      type='password'
                      placeholder='••••••••'
                      {...field}
                      className='pr-10'
                    />
                    <LockKeyhole className='absolute right-3 h-4 w-4 text-muted-foreground' />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11'
            disabled={isPending}
          >
            {isPending ? "Validando..." : "Iniciar Sesión"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
