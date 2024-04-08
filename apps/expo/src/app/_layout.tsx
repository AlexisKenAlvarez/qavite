/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useCallback } from "react";
import { AppState } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { supabase } from "@/trpc/supabase";
import { TRPCProvider } from "@/utils/api";

export default function Layout() {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });

  const [fontsLoaded, fontError] = useFonts({
    "DMSerifDisplay-Regular": require("../../assets/fonts/DMSerifDisplay-Regular.ttf"),
  });

  useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <TRPCProvider>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </TRPCProvider>
  );
}
