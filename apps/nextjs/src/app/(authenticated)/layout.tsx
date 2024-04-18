import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Container from "@/component/Container";
import Nav from "@/component/Nav";
import { supabaseServer } from "@/supabase/supabaseServer";

const layout = async ({ children }: { children: ReactNode }) => {
  const supabase = supabaseServer();

  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    redirect("/auth");
  }

  return (
    <Container className="flex min-h-screen items-stretch p-0 ">
      <Nav />
      <div className="w-full p-5 min-h-screen flex">
        <div className="bg-bg p-3 w-full rounded-xl">{children}</div>
      </div>
    </Container>
  );
};

export default layout;
