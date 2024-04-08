import { Pressable, Text, TextInput, View } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "expo-router";
import { InputStyles, primaryColor, styles, textStyles } from "@/lib/styles";

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
      <View style={[styles.containerCenter, { alignItems: "center" }]}>
        <Text style={[textStyles.headerSans, textStyles.xl4]}>LOGO</Text>
        <View
          style={{ marginTop: 40, width: "100%", display: "flex", gap: 20 }}
        >
          <View style={{ position: "relative" }}>
            <FontAwesome5
              name="user"
              size={17}
              color="black"
              style={InputStyles.icon}
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
                    style={
                      errors.email
                        ? [InputStyles.isError, InputStyles.withIcon]
                        : [InputStyles.isValid, InputStyles.withIcon]
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

          <View style={{ position: "relative" }}>
            <View style={InputStyles.icon}>
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
                    style={
                      errors.email
                        ? [InputStyles.isError, InputStyles.withIcon]
                        : [InputStyles.isValid, InputStyles.withIcon]
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
        </View>

        <Pressable style={styles.button} onPress={form.handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Link
          href={{
            pathname: "/(app)/auth/forgot",
            params: {
              type: "send-email",
            },
          }}
          style={{marginTop: 20}}
        >
          <Text
            style={[
              textStyles.lg,
              textStyles.headerSans,
              { color: primaryColor },
            ]}
          >
            Forgot password?
          </Text>
        </Link>
      </View>
    </>
  );
};

export default Signin;
