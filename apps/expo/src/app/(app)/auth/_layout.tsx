import type { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { router, Tabs, usePathname } from "expo-router";
import { primaryColor, styles, textStyles } from "@/lib/styles";
import { supabase } from "@/trpc/supabase";
import { AntDesign } from "@expo/vector-icons";

export default function Layout() {
  const pathname = usePathname();

  useEffect(() => {
    void (async () => {
      const checkSession = (session: Session | null) => {
        if (session && pathname !== "/auth/forgot") {
          console.log(pathname);
          console.log("redirecting");
          if (Platform.OS === "ios") {
            setTimeout(() => {
              router.replace("/(app)/(authenticated)/");
            }, 1);
          } else {
            setImmediate(() => {
              router.replace("/(app)/(authenticated)/");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
      }}
      tabBar={() => {
        if (pathname !== "/auth/forgot") {
          return (
            <View style={styles.authLayoutTab}>
              <Text style={textStyles.lg}>
                {pathname === "/auth/signin"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </Text>
              <Pressable
                onPress={() => {
                  if (pathname === "/auth/signin") {
                    router.push("/auth/signup");
                  } else {
                    router.push("/auth/signin");
                  }
                }}
              >
                <Text
                  style={[
                    textStyles.headerSans,
                    textStyles.lg,
                    { marginLeft: 4, color: primaryColor },
                  ]}
                >
                  {pathname === "/auth/signin" ? "Sign up" : "Sign in"}
                </Text>
              </Pressable>
            </View>
          );
        }
      }}
    >
      <Tabs.Screen
        name="signin"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="forgot"
        options={{
          headerShown: true,
          headerLeftContainerStyle: {
            paddingLeft: 12,
          },
          headerLeft: () => (
            <Pressable style={styles.roundButton} onPress={() => router.back()}>
              <AntDesign name="arrowleft" size={17} color="white" />
            </Pressable>
          ),
          headerTitleStyle: styles.signupHeader,
          headerTitle: "Password Reset",
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          headerShown: true,
          headerLeftContainerStyle: {
            paddingLeft: 12,
          },
          headerLeft: () => (
            <Pressable style={styles.roundButton} onPress={() => router.back()}>
              <AntDesign name="arrowleft" size={17} color="white" />
            </Pressable>
          ),
          headerTitleStyle: styles.signupHeader,
          headerTitle: "Sign Up",
        }}
      />
    </Tabs>
  );
}