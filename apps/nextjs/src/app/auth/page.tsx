import Auth from "@/component/Auth";
import { supabaseServer } from "@/supabase/supabaseServer";
import { redirect } from "next/navigation";

const page = async () => {

  const supabase = supabaseServer()

  const { data } = await supabase.auth.getSession()

  if (data.session) {
    redirect('/')
  }

  return <Auth />;
};

export default page;
