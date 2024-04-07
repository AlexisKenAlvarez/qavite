import { validateEmailDomain } from "@/lib/helpers";
import { InputStyles, primaryColor, styles, textStyles } from "@/lib/styles";
import { supabase } from "@/trpc/supabase";
import { api } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  FlatList,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { z } from "zod";

const Signup = () => {
  const formArr = [
    {
      label: "firstname",
      placeholder: "Juan",
      isPassword: false,
    },

    {
      label: "lastname",
      placeholder: "Dela Cruz",
      isPassword: false,
    },
    {
      label: "email",
      placeholder: "juandelacruz@cvsu.edu.ph",
      isPassword: false,
    },
    {
      label: "password",
      placeholder: "Password",
      isPassword: true,
    },
    {
      label: "confirmPassword",
      placeholder: "Confirm Password",
      isPassword: true,
    },
  ];
  const [agreed, setAgreed] = useState(false);
  const createUserMutation = api.auth.createUser.useMutation();

  const formSchema = z
    .object({
      firstname: z.string().min(1, { message: "Required!" }),
      lastname: z.string().min(1, { message: "Required!" }),
      email: z.string().email(),
      password: z.string().min(6).max(20),
      confirmPassword: z.string().min(6).max(20),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!validateEmailDomain(values.email)) {
      form.setError("email", { message: "Must be a CvSU email." });
      return;
    }

    await createUserMutation.mutateAsync({
      email: values.email,
      password: values.password,
      firstname: values.firstname,
      lastname: values.lastname,
    });

    const { error: signinError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (signinError) {
      console.error("Failed to sign in.");
      return;
    }

    console.log(values);
  }

  return (
    <>
      <ScrollView
        style={{ backgroundColor: "white", padding: 20, flex: 1 }}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <Text
          style={[
            textStyles.headerSans,
            textStyles.xl4,
            { color: primaryColor, marginTop: 20, textAlign: "center" },
          ]}
        >
          LOGO
        </Text>
        <View
          style={{ marginTop: 40, width: "100%", display: "flex", gap: 20 }}
        >
          {formArr.map((item) => (
            <View style={{ position: "relative" }} key={item.label}>
              <Controller
                control={form.control}
                render={({
                  formState: { errors },
                  field: { onChange, onBlur, value },
                }) => (
                  <>
                    <TextInput
                      placeholder={item.placeholder}
                      onBlur={onBlur}
                      onChangeText={(text) => onChange(text)}
                      value={value}
                      secureTextEntry={item.isPassword}
                      style={
                        errors[`${item.label}`]
                          ? [InputStyles.isError, InputStyles.default]
                          : [InputStyles.isValid, InputStyles.default]
                      }
                    />

                    {errors[`${item.label}`] && (
                      <Text style={InputStyles.errorMessage}>
                        {errors[`${item.label}`].message}
                      </Text>
                    )}
                  </>
                )}
                name={
                  item.label as
                    | "firstname"
                    | "lastname"
                    | "email"
                    | "password"
                    | "confirmPassword"
                }
                rules={{ required: true }}
              />
            </View>
          ))}
        </View>

        <View style={[styles.center, { marginTop: 20, flexDirection: "row" }]}>
          <BouncyCheckbox
            size={20}
            fillColor="#008400"
            iconStyle={{
              borderColor: "#008400",
              marginRight: 0,
              paddingRight: 0,
            }}
            innerIconStyle={{ borderWidth: 1.5 }}
            isChecked={agreed}
            onPress={(isChecked: boolean) => {
              setAgreed(isChecked);
            }}
          />

          <Text style={[textStyles.lg, { marginLeft: -4 }]}>
            I agree to the{" "}
            <Text style={{ fontWeight: "bold", color: primaryColor }}>
              Terms of Service
            </Text>
          </Text>
        </View>

        <Pressable
          disabled={!agreed}
          style={styles.button}
          onPress={form.handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </ScrollView>
    </>
  );
};

export default Signup;
