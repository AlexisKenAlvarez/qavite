import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { BlurView } from "expo-blur";
import { validateEmailDomain } from "@/lib/helpers";
import { InputStyles, primaryColor, styles, textStyles } from "@/lib/styles";
import { supabase } from "@/trpc/supabase";
import { api } from "@/utils/api";
import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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

const Signup = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [agreed, setAgreed] = useState(false);
  const createUserMutation = api.auth.createUser.useMutation({
    onError: (error) => {
      console.error("Failed to create user.", error);
    },
  });

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
                        errors[item.label as keyof typeof errors]
                          ? [InputStyles.isError, InputStyles.default]
                          : [InputStyles.isValid, InputStyles.default]
                      }
                    />

                    {errors[item.label as keyof typeof errors] && (
                      <Text style={InputStyles.errorMessage}>
                        {errors[item.label as keyof typeof errors]?.message}
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
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
            </Text>
            <Pressable onPress={() => setModalVisible(true)}>
              <Text
                style={[
                  textStyles.lg,
                  { fontWeight: "bold", color: primaryColor },
                ]}
              >
                Terms of Service
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          disabled={!agreed}
          style={styles.button}
          onPress={form.handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>

        <Modal visible={modalVisible} transparent>
          <BlurView
            experimentalBlurMethod={"dimezisBlurView"}
            style={modalStyle.container}
          >
            <View style={modalStyle.modal}>
              <Text
                style={[
                  textStyles.xl,
                  { fontWeight: "bold", textAlign: "center" },
                ]}
              >
                Privacy Policy
              </Text>
              <Pressable style={modalStyle.closeButton} onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={24} color={primaryColor} />
              </Pressable>

              <Text style={[textStyles.lg, { marginTop: 20 }]}>
                Acknowledgment
              </Text>
              <Text style={[textStyles.lg, {textAlign: "justify", lineHeight: 32, marginTop: 8}]}>
                These are the Terms and Conditions governing the use of this
                Service and the agreement that operates between You and the
                Company. These Terms and Conditions set out the rights and
                obligations of all users regarding the use of the Service. Your
                access to and use of the Service is conditioned on Your
                acceptance of and compliance with these Terms and Conditions.
                These Terms and Conditions apply to all visitors,
              </Text>
            </View>
          </BlurView>
        </Modal>
      </ScrollView>
    </>
  );
};

export default Signup;

const modalStyle = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },

  modal: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "white",
    borderColor: primaryColor,
    borderWidth: 1,
    padding: 20,
  },

  closeButton: {
    position: "absolute",
    right: 15,
    top: 15,
  },
});
