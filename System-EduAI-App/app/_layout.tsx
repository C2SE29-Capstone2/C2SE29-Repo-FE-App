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
      <Stack.Screen
        name="students/create_shedule"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/extracurricular_manager"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/menu_suggestion"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/diet_tracking"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/notification"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/search"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/create_schedule"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/study_statistic"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/growth_report"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/study_speed_analysis"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/face_recognition"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="parents/message_parent"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="parents/access_control"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="parents/nur_a1_class"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="parents/goodbye_control"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}