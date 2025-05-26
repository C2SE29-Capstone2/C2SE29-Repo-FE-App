import { Stack, useRouter } from "expo-router";
import './global.css';

export default function RootLayout() {

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="eduId/[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="teachers/home"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="teachers/album"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="teachers/comment"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="teachers/message_page"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="teachers/notification_page"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="teachers/post_page"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="parents/home_parent"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="teachers/medicine_page"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="teachers/update_teacher_page"
        options={{ headerShown: false }}
      />

    </Stack>
  );
}