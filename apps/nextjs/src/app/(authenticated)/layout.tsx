import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Container from "@/component/Container";
import Nav from "@/component/Nav";
import { supabaseServer } from "@/supabase/supabaseServer";

const layout = async ({ children }: { children: ReactNode }) => {
  const supabase = supabaseServer();

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/auth");
  }

  return (
    <Container className="flex min-h-screen items-stretch p-0 ">
      <Nav />
      <div className="w-full lg:p-5 min-h-screen flex">
        <div className="bg-bg p-3 w-full lg:rounded-xl flex-1">{children}</div>
      </div>
    </Container>
  );
};

export default layout;
