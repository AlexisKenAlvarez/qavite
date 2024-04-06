import { Slot, SplashScreen } from "expo-router";
import Providers from "@/providers";
import { AppState, View } from "react-native";
import { supabase } from "@/trpc/supabase";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { useCallback } from "react";

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

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Providers>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </Providers>
  );
}
