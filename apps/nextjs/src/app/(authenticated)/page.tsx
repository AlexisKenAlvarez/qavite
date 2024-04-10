'use client'

import { supabase } from "@/supabase/supabaseClient";
import { Button } from "@qavite/ui/button";

const page = () => {
  return (
    <div>
      {process.env.NEXT_PUBLIC_SUPABASE_URL}
      <Button onClick={async () => await supabase.auth.signOut()}>
        Log out
      </Button>
    </div>
  );
}

export default page;