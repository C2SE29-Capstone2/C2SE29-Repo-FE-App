import { Stack } from "expo-router";
import React from "react";

export default function ParentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home_parent" />
      <Stack.Screen name="message_parent" />
      {/* Add other parent-specific screens here */}
    </Stack>
  );
}
