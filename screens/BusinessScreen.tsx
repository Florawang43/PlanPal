import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebase";
import { getUserProfile, UserProfile } from "../services/firestoreService";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../types/navigation";


export default function BusinessScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      async (user: User | null) => {
        if (user) {
          const p = await getUserProfile(user.uid);
          setProfile(p);
        } else {
          setProfile(null);
          await AsyncStorage.removeItem("userToken");
        }
      }
    );
    return unsub;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert("Signed out");
    } catch (error: any) {
      Alert.alert("Sign out error", error.message);
    }
  };

  if (!profile) {
    return <Text>Loading profile...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome, {profile.email}
      </Text>
      <Text style={styles.subtitle}>
        Member since: {profile.createdAt?.toDate?.().toLocaleDateString?.() || ""}
      </Text>
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button
      title="Edit Profile"
      onPress={() => navigation.navigate("Profile")}
      />
      <Button title="Profile Settings" onPress={() => navigation.navigate("Profile")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  subtitle: { fontSize: 14, marginBottom: 20 },
});
