import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">;

export default function SignInScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state handler will navigate to main app automatically
    } catch (error: any) {
      Alert.alert("Sign in failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Welcome back! Please login to your account.</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Text>{showPassword ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>SIGN IN</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text>
            Don't have an account?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("SignUp")}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 28 },
  title: { fontSize: 36, fontWeight: "bold", marginBottom: 12, marginTop: 36, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#aaa", marginBottom: 28, textAlign: "center" },
  input: {
    borderWidth: 1, borderColor: "#bbb", borderRadius: 6,
    padding: 12, marginBottom: 18, backgroundColor: "#fafafa", fontSize: 16,
  },
  button: {
    backgroundColor: "#222", borderRadius: 6, paddingVertical: 16, alignItems: "center", marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  link: { color: "#F75A1A", fontWeight: "bold" },
  passwordRow: {
    flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#bbb", borderRadius: 6,
    backgroundColor: "#fafafa", marginBottom: 18, paddingRight: 8,
  },
  eyeButton: { padding: 8 },
});
