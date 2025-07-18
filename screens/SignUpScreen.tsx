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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { createUserProfile } from "../services/firestoreService";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

export default function SignUpScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirm) {
      Alert.alert("Please fill all fields.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Password must be at least 6 characters.");
      return;
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile({
        uid: cred.user.uid,
        email,
        displayName: fullName,
      });
      Alert.alert("Sign up successful!");
      navigation.replace("SignIn");
    } catch (err: any) {
      Alert.alert("Sign up failed", err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Create your account</Text>
        <TextInput
          placeholder="Full name"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.passwordRow}>
          <TextInput
            placeholder="Password"
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eye}
            onPress={() => setShowPassword((v) => !v)}
          >
            <Text>{showPassword ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.passwordRow}>
          <TextInput
            placeholder="Confirm your password"
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry={!showConfirm}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eye}
            onPress={() => setShowConfirm((v) => !v)}
          >
            <Text>{showConfirm ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text>
            Already have an account?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("SignIn")}
            >
              Login
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
  eye: { padding: 8 },
});
