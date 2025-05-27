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
      <Stack.Screen
        name="students/home_student"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/profile_student"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/edit_profile_student"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/update_measurement_student"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/growth_tracking"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/daily_schedule"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}