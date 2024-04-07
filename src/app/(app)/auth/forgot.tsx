import { validateEmailDomain } from "@/lib/helpers";
import { InputStyles, styles, textStyles } from "@/lib/styles";
import { supabase } from "@/trpc/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { set, z } from "zod";
import { OtpInput } from "react-native-otp-entry";

type Tokens = {
  access_token: string;
  refresh_token: string;
};

export const SendEmail = () => {
  const [debounce, setDebounce] = useState(false);
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
    setDebounce(true);
    if (!validateEmailDomain(values.email)) {
      form.setError("email", { message: "Must be a CvSU email." });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(values.email);

    if (error) {
      // Add toast here
      console.log(error);
      setDebounce(false);

      return;
    }

    router.push({
      pathname: "/auth/forgot",
      params: { type: "reset-password", email: values.email },
    });
  }

  return (
    <View style={styles.container}>
      <Text
        style={[
          textStyles.headerSans,
          textStyles.xl3,
          { textAlign: "center", marginTop: 5 },
        ]}
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

      <Pressable
        style={[styles.button, debounce && { opacity: 50 }]}
        disabled={debounce}
        onPress={form.handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
};

export const ResetPassword = ({ email }: { email: string }) => {
  const [otpDebounce, setOtpDebounce] = useState(false);
  const [passDebounce, setPassDebounce] = useState(false);
  const [valid, setValid] = useState(false);

  const formSchema = z.object({
    password: z.string().min(6).max(20),
    confirmPassword: z.string().min(6).max(20),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPassDebounce(true);
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      setPassDebounce(false);
    }

    router.replace({
      pathname: "/",
    });
  }

  

  return (
    <View style={styles.container}>
      {!valid ? (
        <>
          <Text
            style={[
              textStyles.headerSans,
              textStyles.xl3,
              { textAlign: "center", marginTop: 5 },
            ]}
          >
            Enter 6 digit pin
          </Text>
          <Text style={{ marginLeft: 4, textAlign: "center", marginBottom: 8 }}>
            We sent a 6 digit pin to your email. Please check your inbox
            including spam folders.
          </Text>

          <OtpInput
            numberOfDigits={6}
            theme={{
              containerStyle: {
                marginTop: 20,
              },
            }}
            onFilled={async (text) => {
              setOtpDebounce(true);
              const { data, error } = await supabase.auth.verifyOtp({
                email,
                token: text,
                type: "recovery",
              });

              if (error) {
                // Add toast here
                console.log(error);
                setOtpDebounce(false);
                return;
              }

              if (data) {
                setValid(true);
              }
            }}
            disabled={otpDebounce}
          />
        </>
      ) : (
        <>
          <Text
            style={[
              textStyles.headerSans,
              textStyles.xl3,
              { textAlign: "center", marginTop: 5 },
            ]}
          >
            Enter your new password
          </Text>
          <Text style={{ marginLeft: 4, textAlign: "center", marginBottom: 8 }}>
            A secure password comprises a minimum of six characters and serves
            to protect your account.
          </Text>
          <View style={{ display: "flex", gap: 20, marginTop: 28 }}>
            <View>
              <Controller
                control={form.control}
                render={({
                  formState: { errors },
                  field: { onChange, onBlur, value },
                }) => (
                  <>
                    <TextInput
                      placeholder="Password"
                      onBlur={onBlur}
                      onChangeText={(text) => onChange(text)}
                      value={value}
                      secureTextEntry
                      style={
                        errors.password
                          ? [InputStyles.isError, InputStyles.default]
                          : [InputStyles.isValid, InputStyles.default]
                      }
                    />

                    {errors.password && (
                      <Text style={InputStyles.errorMessage}>
                        {errors.password.message}
                      </Text>
                    )}
                  </>
                )}
                name="password"
                rules={{ required: true }}
              />
            </View>

            <View>
              <Controller
                control={form.control}
                render={({
                  formState: { errors },
                  field: { onChange, onBlur, value },
                }) => (
                  <>
                    <TextInput
                      placeholder="Confirm password"
                      onBlur={onBlur}
                      onChangeText={(text) => onChange(text)}
                      value={value}
                      secureTextEntry
                      style={
                        errors.confirmPassword
                          ? [InputStyles.isError, InputStyles.default]
                          : [InputStyles.isValid, InputStyles.default]
                      }
                    />

                    {errors.confirmPassword && (
                      <Text style={InputStyles.errorMessage}>
                        {errors.confirmPassword.message}
                      </Text>
                    )}
                  </>
                )}
                name="confirmPassword"
                rules={{ required: true }}
              />
            </View>
          </View>

          <Pressable
            style={[styles.button, passDebounce && { opacity: 50 }]}
            disabled={passDebounce}
            onPress={form.handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

const Forgot = () => {
  const params = useLocalSearchParams();
  console.log("🚀 ~ Forgot ~ params:", params);

  return (
    <View>
      <View>
        {params.type === "send-email" ? (
          <SendEmail />
        ) : (
          <ResetPassword email={params.email as string} />
        )}
      </View>
    </View>
  );
};

export default Forgot;
