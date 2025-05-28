import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const UpdateStudentPage = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { token } = useAuth();

  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentAddress, setStudentAddress] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [studentGender, setStudentGender] = useState(false);
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Load data from params
    if (params.studentName) setStudentName(params.studentName as string);
    if (params.studentPhone) setStudentPhone(params.studentPhone as string);
    if (params.studentAddress)
      setStudentAddress(params.studentAddress as string);
    if (params.accountEmail) setAccountEmail(params.accountEmail as string);
    if (params.dateOfBirth) setDateOfBirth(params.dateOfBirth as string);
    if (params.studentGender) setStudentGender(params.studentGender === "true");
    if (params.parentName) setParentName(params.parentName as string);
    if (params.parentPhone) setParentPhone(params.parentPhone as string);
  }, [params]);

  const handleUpdate = async () => {
    // Validate required fields
    if (
      !studentName ||
      !studentPhone ||
      !studentAddress ||
      !accountEmail ||
      !dateOfBirth ||
      !parentName ||
      !parentPhone
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      Alert.alert(
        "Lỗi",
        "Ngày sinh không hợp lệ. Vui lòng nhập theo định dạng YYYY-MM-DD."
      );
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountEmail)) {
      Alert.alert("Lỗi", "Email không hợp lệ!");
      return;
    }

    setIsUpdating(true);
    try {
      const updateDto = {
        studentName: studentName.trim(),
        studentPhone: studentPhone.trim(),
        studentAddress: studentAddress.trim(),
        accountEmail: accountEmail.trim(),
        dateOfBirth: dateOfBirth.trim(),
        studentGender: studentGender,
        parentName: parentName.trim(),
        parentPhone: parentPhone.trim(),
      };

      let updatedSuccess = false;
      if (token) {
        console.log("Updating student with real API", updateDto);
        const updated = await authApi.updateStudentDetail(token, updateDto);
        if (updated) {
          updatedSuccess = true;
          Alert.alert("Thành công", "Cập nhật thông tin thành công!");
        } else {
          Alert.alert(
            "Lỗi",
            "Cập nhật thất bại từ API! Vui lòng kiểm tra thông tin đầu vào."
          );
        }
      } else {
        console.log("Simulating update (no token)");
        updatedSuccess = true;
        Alert.alert("Thành công", "Cập nhật thông tin thành công! (Mô phỏng)");
      }

      if (updatedSuccess) {
        setTimeout(() => {
          setIsUpdating(false);
          try {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/parents/student_account_page");
            }
          } catch (error) {
            console.warn("Navigation error, using fallback:", error);
            router.replace("/parents/student_account_page");
          }
        }, 1000);
      } else {
        setIsUpdating(false);
      }
    } catch (error) {
      console.error("Error updating student:", error);
      Alert.alert("Lỗi", "Cập nhật thất bại!");
      setIsUpdating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cập Nhật Thông Tin</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Thông Tin Học Sinh</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên *</Text>
            <TextInput
              style={styles.input}
              value={studentName}
              onChangeText={setStudentName}
              placeholder="Nhập họ và tên học sinh"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại *</Text>
            <TextInput
              style={styles.input}
              value={studentPhone}
              onChangeText={setStudentPhone}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ *</Text>
            <TextInput
              style={styles.input}
              value={studentAddress}
              onChangeText={setStudentAddress}
              placeholder="Nhập địa chỉ"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={accountEmail}
              onChangeText={setAccountEmail}
              placeholder="Nhập email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ngày sinh (YYYY-MM-DD) *</Text>
            <TextInput
              style={styles.input}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="2020-01-15"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giới tính</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  !studentGender && styles.genderButtonActive,
                ]}
                onPress={() => setStudentGender(false)}
              >
                <Text
                  style={[
                    styles.genderText,
                    !studentGender && styles.genderTextActive,
                  ]}
                >
                  Nữ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  studentGender && styles.genderButtonActive,
                ]}
                onPress={() => setStudentGender(true)}
              >
                <Text
                  style={[
                    styles.genderText,
                    studentGender && styles.genderTextActive,
                  ]}
                >
                  Nam
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Thông Tin Phụ Huynh</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên phụ huynh *</Text>
            <TextInput
              style={styles.input}
              value={parentName}
              onChangeText={setParentName}
              placeholder="Nhập họ và tên phụ huynh"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại phụ huynh *</Text>
            <TextInput
              style={styles.input}
              value={parentPhone}
              onChangeText={setParentPhone}
              placeholder="Nhập số điện thoại phụ huynh"
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.updateButton, isUpdating && styles.disabledButton]}
            onPress={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>CẬP NHẬT</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    height: 100,
    backgroundColor: "#4DB6AC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    marginTop: -20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: 600,
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 16,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f8fafc",
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  genderButtonActive: {
    backgroundColor: "#4DB6AC",
    borderColor: "#4DB6AC",
  },
  genderText: {
    fontSize: 16,
    color: "#666",
  },
  genderTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  updateButton: {
    backgroundColor: "#4DB6AC",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UpdateStudentPage;
