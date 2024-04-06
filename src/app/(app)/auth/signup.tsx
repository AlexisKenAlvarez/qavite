import { validateEmailDomain } from "@/lib/helpers";
import { InputStyles } from "@/lib/styles";
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
  View
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { z } from "zod";

const Signup = () => {
  const [agreed, setAgreed] = useState(false);
  const createUserMutation = api.auth.createUser.useMutation();



  const formSchema = z
    .object({
      firstname: z.string().min(1),
      lastname: z.string().min(1),
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

    console.log("User created!");
  }

  return (
    <>
      <ScrollView className="bg-white h-full p-5">
        <Text className="font-sans text-4xl text-primary text-center mt-5">
          LOGO
        </Text>
        <View className="mt-10 w-full flex gap-4">
          <View className="relative shadow-md">
            <Controller
              control={form.control}
              render={({
                formState: { errors },
                field: { onChange, onBlur, value },
              }) => (
                <>
                  <TextInput
                    placeholder="Juan"
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(text)}
                    value={value}
                    style={errors.firstname ? InputStyles.isError : InputStyles.isValid}
                    className=" w-full border py-3 rounded-full px-7  text-lg"
                  />

                  {errors.firstname && (
                    <Text className="ml-5 mt-1 text-red-500">
                      {errors.firstname.message}
                    </Text>
                  )}
                </>
              )}
              name="firstname"
              rules={{ required: true }}
            />
          </View>

          <View className="relative shadow-md">
            <Controller
              control={form.control}
              render={({
                formState: { errors },
                field: { onChange, onBlur, value },
              }) => (
                <>
                  <TextInput
                    placeholder="Dela Cruz"
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(text)}
                    value={value}
                    style={errors.lastname ? InputStyles.isError : InputStyles.isValid}
                    className=" w-full border py-3 rounded-full px-7  text-lg"
                  />

                  {errors.lastname && (
                    <Text className="ml-5 mt-1 text-red-500">
                      {errors.lastname.message}
                    </Text>
                  )}
                </>
              )}
              name="lastname"
              rules={{ required: true }}
            />
          </View>

          <View className="relative shadow-md">
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

          <View className="relative shadow-md">
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
                    style={errors.password ? InputStyles.isError : InputStyles.isValid}
                    className=" w-full border py-3 rounded-full px-7  text-lg"
                  />

                  {errors.password && (
                    <Text className="ml-5 mt-1 text-red-500">
                      {errors.password.message}
                    </Text>
                  )}
                </>
              )}
              name="password"
              rules={{ required: true }}
            />
          </View>

          <View className="relative shadow-md">
            <Controller
              control={form.control}
              render={({
                formState: { errors },
                field: { onChange, onBlur, value },
              }) => (
                <>
                  <TextInput
                    placeholder="Confirm Password"
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(text)}
                    value={value}
                    secureTextEntry
                    style={
                      errors.confirmPassword ? InputStyles.isError : InputStyles.isValid
                    }
                    className=" w-full border py-3 rounded-full px-7  text-lg"
                  />

                  {errors.confirmPassword && (
                    <Text className="ml-5 mt-1 text-red-500">
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

        <View className="flex flex-row items-center justify-center mt-5">
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

          <Text className=" text-lg -ml-1">
            I agree to the{" "}
            <Text className="text-primary font-bold">Terms of Service</Text>
          </Text>
        </View>

        <Pressable
          disabled={!agreed}
          className="w-full rounded-full py-3 bg-primary mt-14"
          onPress={form.handleSubmit(onSubmit)}
        >
          <Text className="text-white text-center font-bold text-lg">
            Continue
          </Text>
        </Pressable>
      </ScrollView>
    </>
  );
};

export default Signup;


