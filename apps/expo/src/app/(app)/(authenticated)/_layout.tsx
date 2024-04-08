import type { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { Platform } from "react-native";
import { router, Tabs } from "expo-router";
import { supabase } from "@/trpc/supabase";

export default function AuthenticatedLayout() {
  useEffect(() => {
    void (async () => {
      const checkSession = (session: Session | null) => {
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

      await supabase.auth.getSession().then(({ data: { session } }) => {
        checkSession(session);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        checkSession(session);
      });

      return () => subscription.unsubscribe();
    })();
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
