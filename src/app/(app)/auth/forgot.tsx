import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateEmailDomain } from "@/lib/helpers";
import { InputStyles } from "@/lib/styles";
import { supabase } from "@/trpc/supabase";
import * as Linking from "expo-linking";

export const SendEmail = () => {
  const resetPasswordURL = Linking.createURL("/auth/forgot?type=reset");
  const formSchema = z.object({
    email: z.string().email(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!validateEmailDomain(values.email)) {
      form.setError("email", { message: "Must be a CvSU email." });
      return;
    }
    console.log(resetPasswordURL);
    // const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
    //   redirectTo: resetPasswordURL,
    // });

    // if (error) {
    //   console.log(error);
    //   return;
    // }
  }

  return (
    <View className="bg-white h-full p-5 flex  justify-center">
      <Text className="text-center text-3xl font-sans text-primary">
        Forgot password
      </Text>
      <Text className="ml-4 text-center">
        Please enter your email to reset your password.
      </Text>
      <View className="relative shadow-md w-full mt-7">
        <Controller
          control={form.control}
          render={({
            formState: { errors },
            field: { onChange, onBlur, value },
          }) => (
            <>
              <TextInput
                placeholder="juandelacruz@cvsu.edu.ph"
                onBlur={onBlur}
                onChangeText={(text) => onChange(text)}
                value={value}
                style={errors.email ? InputStyles.isError : InputStyles.isValid}
                className=" w-full border py-3 rounded-full px-7  text-lg"
              />

              {errors.email && (
                <Text className="ml-5 mt-1 text-red-500">
                  {errors.email.message}
                </Text>
              )}
            </>
          )}
          name="email"
          rules={{ required: true }}
        />
      </View>

      <Pressable
        className="w-full rounded-full py-3 bg-primary mt-6"
        onPress={form.handleSubmit(onSubmit)}
      >
        <Text className="text-white text-center font-bold text-lg">
          Continue
        </Text>
      </Pressable>
    </View>
  );
};

export const ResetPassword = () => {
  return (
    <View>
      <Text>Reset</Text>
    </View>
  );
};

const Forgot = () => {
  const params = useLocalSearchParams();

  return (
    <View>
      <View>
        {params.type === "send-email" ? <SendEmail /> : <ResetPassword />}
      </View>
    </View>
  );
};

export default Forgot;
