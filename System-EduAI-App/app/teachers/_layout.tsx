import { Stack } from "expo-router";
import React from "react";

export default function TeacherLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="account_page" />
      <Stack.Screen name="update_teacher_page" />
      <Stack.Screen name="contact_page" />
      <Stack.Screen name="medicine_page" />
      <Stack.Screen name="message_page" />
      <Stack.Screen name="notification_page" />
      <Stack.Screen name="post_page" />
      <Stack.Screen name="album" />
      <Stack.Screen name="comment" />
      {/* Add other teacher-specific screens here */}
    </Stack>
  );
}
