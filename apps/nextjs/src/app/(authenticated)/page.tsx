
import Container from "@/component/Container";
import Hero from "@/component/dashboard/Hero";
import Nav from "@/component/dashboard/Nav";
import Reports from "@/component/dashboard/Reports";
import { navigations } from "@/lib/constants";
import { supabase } from "@/supabase/supabaseClient";
import { Button } from "@qavite/ui/button";

const page = ({searchParams}: {searchParams?: { [key: string]: string | string[] | undefined }}) => {

  const section = searchParams?.section

  return (
    <Container className="min-h-screen flex p-0 h-full items-start justify-start">
      <Nav/>
      {navigations.map((item) => {
        if (item.paths.includes(section as string)) {
          return (
            <item.component key={item.label} />
          )
        }
      })}
      
    </Container>
  );
}

export default page;