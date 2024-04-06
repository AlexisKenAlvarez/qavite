import { supabase } from "@/trpc/supabase";
import type { Session } from "@supabase/supabase-js";
import { Tabs, router } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function AuthenticatedLayout() {
  useEffect(() => {
    const checkSession = (session: Session) => {
      if (!session) {
        if (Platform.OS === "ios") {
          setTimeout(() => {
            router.replace("/(app)/auth/signin");
          }, 1);
        } else {
          setImmediate(() => {
            router.replace("/(app)/auth/signin");
          });
        }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      checkSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
