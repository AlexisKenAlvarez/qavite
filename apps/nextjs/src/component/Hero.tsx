"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@qavite/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qavite/ui/form";
import { Input } from "@qavite/ui/input";

import Container from "./Container";

const Hero = () => {
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

  function onSubmit(data: formType) {
    console.log(onSubmit);
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
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center rounded-xl bg-white pt-5 pb-10 px-10 ">
        <Image alt="Logo" width={100} height={100} src="/logo.webp" />
        <h1 className="uppercase font-bold text-primary text-2xl mb-2">Qavite Admin</h1>
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
                    <Input placeholder="Email" className="rounded-full py-5 px-5 border-primary" {...field} />
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
                    <Input placeholder="Password" className="rounded-full py-5 px-5 border-primary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-white rounded-full font-bold">SignIn</Button>
          </form>
        </Form>
      </div>
    </Container>
  );
};

export default Hero;
