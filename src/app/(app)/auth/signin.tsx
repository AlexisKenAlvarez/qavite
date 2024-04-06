import {
  Button,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, router } from "expo-router";
import { InputStyles } from "@/lib/styles";

const Signin = () => {
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
      <View className="bg-white h-full p-5 flex items-center justify-center">
        <Text className="font-sans text-4xl text-primary">LOGO</Text>
        <View className="mt-10 w-full flex gap-5">
          <View className="relative shadow-md">
            <FontAwesome5
              name="user"
              size={17}
              color="black"
              className="absolute translate-y-1/2 top-2 left-8 items-center flex-row gap-2 opacity-50"
            />

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
                    className=" w-full border py-3 rounded-full px-7 pl-16 text-lg"
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
            <View className="absolute translate-y-1/2 left-8 top-1 flex items-center flex-row gap-2 opacity-50">
              <MaterialIcons name="lock-outline" size={20} color="black" />
            </View>
            <Controller
              control={form.control}
              render={({
                formState: { errors },
                field: { onChange, onBlur, value },
              }) => (
                <>
                  <TextInput
                    onBlur={onBlur}
                    placeholder="*********"
                    onChangeText={(text) => onChange(text)}
                    value={value}
                    secureTextEntry
                    style={errors.email ? InputStyles.isError : InputStyles.isValid}
                    className=" w-full border py-3 rounded-full px-7 pl-16 text-lg"
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
        </View>

        <Pressable
          className="w-full mt-16 rounded-full py-3 bg-primary"
          onPress={form.handleSubmit(onSubmit)}
        >
          <Text className="text-white text-center font-bold text-lg">
            Login
          </Text>
        </Pressable>

        <Link
          href={{
            pathname: "/(app)/auth/forgot",
            params: {
              type: "send-email",
            },
          }}
          className="mt-6"
        >
          <Text className=" text-lg text-primary font-bold">
            Forgot password?
          </Text>
        </Link>
      </View>
    </>
  );
};

export default Signin;
