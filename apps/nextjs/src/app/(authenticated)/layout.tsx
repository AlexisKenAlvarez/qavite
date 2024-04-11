import { supabase } from "@/supabase/supabaseClient";
import { supabaseServer } from "@/supabase/supabaseServer";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const layout = async ({children}: {children: ReactNode}) => {

  const supabase = supabaseServer()

  const {data} = await supabase.auth.getSession()

  
  if (!data.session) {
    redirect("/auth")
  }

  return (
    <div>
      {children}
    </div>
  );
}

export default layout;