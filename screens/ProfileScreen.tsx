import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  UserProfile,
} from "../services/firestoreService";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/navigation";

export default function ProfileScreen() {
  type AuthNav = NativeStackNavigationProp<AuthStackParamList, "SignIn">;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<AuthNav>();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUserProfile(user.uid);
        if (data) {
          setProfile(data);
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
        }
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const handleUpdate = async () => {
    if (!profile) return;
    try {
      await updateUserProfile(profile.uid, {
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
      });
      Alert.alert("Profile updated!");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleDelete = async () => {
    if (!profile) return;
    Alert.alert(
      "Are you sure?",
      "This will permanently delete your profile and sign you out.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUserProfile(profile.uid);
              await auth.currentUser?.delete(); 
              await signOut(auth);
              Alert.alert("Profile deleted.");
              navigation.navigate("SignIn");
            } catch (err: any) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
      />
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
      />
      <Text style={styles.label}>Email (read-only):</Text>
      <Text style={styles.email}>{profile?.email}</Text>

      <Button title="Update Profile" onPress={handleUpdate} />
      <View style={{ marginTop: 20 }}>
        <Button title="Delete Profile" color="red" onPress={handleDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  label: { fontSize: 14, color: "#666" },
  email: { fontSize: 16, marginBottom: 24 },
});
