import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateEmailDomain } from "@/lib/helpers";
import { InputStyles, red, styles, textStyles } from "@/lib/styles";
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
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: resetPasswordURL,
    });

    if (error) {
      console.log(error);
      return;
    }
  }

  return (
    <View style={styles.container}>
      <Text
        style={[textStyles.headerSans, textStyles.xl3, { textAlign: "center" }]}
      >
        Forgot password
      </Text>
      <Text style={{ marginLeft: 4, textAlign: "center", marginBottom: 8 }}>
        Please enter your email to reset your password.
      </Text>
      <View style={{ width: "100%", marginTop: 7 }}>
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
                style={
                  errors.email
                    ? [InputStyles.isError, InputStyles.default]
                    : [InputStyles.isValid, InputStyles.default]
                }
              />

              {errors.email && (
                <Text style={InputStyles.errorMessage}>
                  {errors.email.message}
                </Text>
              )}
            </>
          )}
          name="email"
          rules={{ required: true }}
        />
      </View>

      <Pressable style={styles.button} onPress={form.handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Continue</Text>
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
