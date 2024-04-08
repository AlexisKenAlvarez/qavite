import { styles } from "@/lib/styles";
import { supabase } from "@/trpc/supabase";
import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const Home = () => {
  return (
    <View style={styles.container}>
      <Text>Hello World!</Text>
      <Link href="/(app)/auth/signin">Signin</Link>
      <Link href="/(app)/auth/signup">Signup</Link>
      <Pressable onPress={async () => await supabase.auth.signOut()}>
        <Text>Sign out</Text>
      </Pressable>
    </View>
  );
};

export default Home;
