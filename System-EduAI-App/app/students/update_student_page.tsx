import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform, // Ensure Platform is imported
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";

const UpdateStudentPage = () => {
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentAddress, setStudentAddress] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [studentGender, setStudentGender] = useState(false);
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [healthStatus, setHealthStatus] = useState("Healthy"); // Set default value
  const [hobby, setHobby] = useState("None"); // Set default value
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { token } = useAuth();
  const params = useLocalSearchParams();

  // Initialize state only once when the component mounts
  useEffect(() => {
    if (params) {
      setStudentName((params.studentName as string) || "");
      setStudentPhone((params.studentPhone as string) || "");
      setStudentAddress((params.studentAddress as string) || "");
      setAccountEmail((params.accountEmail as string) || "");
      setDateOfBirth((params.dateOfBirth as string) || "");
      setStudentGender(params.studentGender === "true");
      setParentName((params.parentName as string) || "");
      setParentPhone((params.parentPhone as string) || "");
      // Set values from params if available, or use defaults
      setHealthStatus((params.healthStatus as string) || "Healthy");
      setHobby((params.hobby as string) || "None");
    }
  }, []); // Empty dependency array ensures this runs only once

  const handleUpdate = async () => {
    if (!token) {
      Alert.alert("Lỗi", "Không tìm thấy token đăng nhập!");
      return;
    }

    if (
      !studentName.trim() ||
      !studentPhone.trim() ||
      !studentAddress.trim() ||
      !parentName.trim() ||
      !parentPhone.trim()
      // Don't strictly require these as they have defaults
      // !healthStatus.trim() ||
      // !hobby.trim()
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setIsLoading(true);
    try {
      // Ensure healthStatus and hobby are always included with fallback values
      const healthStatusValue = healthStatus.trim() || "Healthy";
      const hobbyValue = hobby.trim() || "None";

      const updateDto = {
        studentName: studentName.trim(),
        studentPhone: studentPhone.trim(),
        studentAddress: studentAddress.trim(),
        accountEmail: accountEmail.trim(),
        dateOfBirth,
        studentGender,
        parentName: parentName.trim(),
        parentPhone: parentPhone.trim(),
        healthStatus: healthStatusValue,
        hobby: hobbyValue,
      };

      // Log the complete request payload for debugging
      console.log("Sending complete update DTO:", JSON.stringify(updateDto));

      const result = await authApi.updateStudentDetail(token, updateDto);

      if (result) {
        Alert.alert("Thành công", "Cập nhật thông tin thành công!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Lỗi", "Cập nhật thông tin thất bại!");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Use Platform to set behavior
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            value={studentName}
            onChangeText={setStudentName}
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={studentPhone}
            onChangeText={setStudentPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Địa chỉ"
            value={studentAddress}
            onChangeText={setStudentAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={accountEmail}
            onChangeText={setAccountEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Ngày sinh (YYYY-MM-DD)"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
          />
          <TextInput
            style={styles.input}
            placeholder="Giới tính (true/false)"
            value={studentGender ? "true" : "false"}
            onChangeText={(text) => setStudentGender(text === "true")}
          />
          <TextInput
            style={styles.input}
            placeholder="Tên phụ huynh"
            value={parentName}
            onChangeText={setParentName}
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại phụ huynh"
            value={parentPhone}
            onChangeText={setParentPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Tình trạng sức khỏe"
            value={healthStatus}
            onChangeText={setHealthStatus}
          />
          <TextInput
            style={styles.input}
            placeholder="Sở thích"
            value={hobby}
            onChangeText={setHobby}
          />
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdate}
            disabled={isLoading}
          >
            <Text style={styles.updateButtonText}>Cập nhật thông tin</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UpdateStudentPage;
