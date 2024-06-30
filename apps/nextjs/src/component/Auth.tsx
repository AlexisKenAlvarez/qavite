"use client";

import { api } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@qavite/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@qavite/ui/form";
import { Input } from "@qavite/ui/input";

import Container from "./Container";

const Auth = () => {
  const router = useRouter();
  const signinMutation = api.auth.adminSignin.useMutation({
    onError: (error) => {
      form.setError("email", {
        message: error.message,
      });
    },
  });

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  type formType = z.infer<typeof formSchema>;

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: formType) {

    try {
      await signinMutation.mutateAsync(data);

      // Redirect to home page
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container className="flex h-screen w-full items-center justify-center">
      <div className="fixed left-0 top-0 h-screen w-full">
        <Image
          alt="Background"
          width={1000}
          height={1000}
          src="/admin-background.webp"
          className="h-full w-full object-cover"
        />
        <div className="bg-green1/80 absolute left-0 top-0 h-full w-full"></div>
      </div>
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center rounded-xl bg-white px-10 pb-10 pt-5 ">
        <Image alt="Logo" width={100} height={100} src="/logo.webp" />
        <h1 className="font-primary mb-2 text-2xl font-bold uppercase text-primary">
          Qavite Admin
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      className="rounded-full border-primary px-5 py-5 text-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      className="rounded-full border-primary px-5 py-5 text-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={signinMutation.isPending}
              className="w-full rounded-full font-bold text-white"
            >
              SignIn
            </Button>
          </form>
        </Form>
      </div>
    </Container>
  );
};

export default Auth;
