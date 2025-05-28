import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { publicApi } from "./services/api";

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    gender: false, // false for female, true for male
    dateOfBirth: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    // Validation
    if (
      !formData.name ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);
    try {
      const result = await publicApi.register({
        name: formData.name,
        username: formData.username,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth || "2000-01-01",
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });

      if (result?.success) {
        Alert.alert("Thành công", "Đăng ký thành công!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Lỗi", result?.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng ký!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Đăng ký tài khoản</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Họ và tên *"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Tên đăng nhập *"
            value={formData.username}
            onChangeText={(text) =>
              setFormData({ ...formData, username: text })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Email *"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Địa chỉ"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Ngày sinh (YYYY-MM-DD)"
            value={formData.dateOfBirth}
            onChangeText={(text) =>
              setFormData({ ...formData, dateOfBirth: text })
            }
          />

          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Giới tính:</Text>
            <TouchableOpacity
              style={[
                styles.genderButton,
                !formData.gender && styles.selectedGender,
              ]}
              onPress={() => setFormData({ ...formData, gender: false })}
            >
              <Text style={styles.genderText}>Nữ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                formData.gender && styles.selectedGender,
              ]}
              onPress={() => setFormData({ ...formData, gender: true })}
            >
              <Text style={styles.genderText}>Nam</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Mật khẩu *"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu *"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) =>
              setFormData({ ...formData, confirmPassword: text })
            }
          />

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? "Đang đăng ký..." : "ĐĂNG KÝ"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F0FA",
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    fontSize: 16,
    color: "#00C853",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  form: {
    padding: 20,
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  genderLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  genderButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
    backgroundColor: "#f8f8f8",
  },
  selectedGender: {
    backgroundColor: "#00C853",
    borderColor: "#00C853",
  },
  genderText: {
    fontSize: 14,
    color: "#333",
  },
  registerButton: {
    backgroundColor: "#00C853",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
