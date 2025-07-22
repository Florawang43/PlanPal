import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStackParamList } from "../types/navigation";
import BusinessScreen from "../screens/BusinessScreen";
import ProfileScreen from "../screens/ProfileScreen";







const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Business"
        component={BusinessScreen}
        options={{ title: "Main App" }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile Settings" }}
      />
    </Stack.Navigator>
  );
}
