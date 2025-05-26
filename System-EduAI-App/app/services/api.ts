import { Alert } from "react-native";

export async function loginApi(username: string, password: string): Promise<{ success: boolean; role?: string }> {
  // Simulated login logic
  if (username === "teacher" && password === "123") {
    return { success: true, role: "teacher" };
  } else if (username === "parent" && password === "123") {
    return { success: true, role: "parent" };
  }
  Alert.alert("Thất bại", "Tài khoản hoặc mật khẩu không đúng!");
  return { success: false };
}