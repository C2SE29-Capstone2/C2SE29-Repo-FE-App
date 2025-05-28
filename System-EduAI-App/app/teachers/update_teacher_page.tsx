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
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";
import DateTimePicker from "@react-native-community/datetimepicker";

const UpdateTeacherPage = () => {
  const [teacherName, setTeacherName] = useState("");
  const [teacherPhone, setTeacherPhone] = useState("");
  const [teacherAddress, setTeacherAddress] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [teacherGender, setTeacherGender] = useState(false);
  const [qualifications, setQualifications] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();
  const { token } = useAuth();
  const params = useLocalSearchParams();

  // Initialize state only once when the component mounts
  useEffect(() => {
    if (params) {
      setTeacherName((params.teacherName as string) || "");
      setTeacherPhone((params.teacherPhone as string) || "");
      setTeacherAddress((params.teacherAddress as string) || "");
      setAccountEmail((params.accountEmail as string) || "");
      setDateOfBirth((params.dateOfBirth as string) || "");
      setTeacherGender(params.teacherGender === "true");
      setQualifications((params.qualifications as string) || "");
    }
  }, []); // Empty dependency array ensures this runs only once

  const handleUpdate = async () => {
    if (!token) {
      Alert.alert("Lỗi", "Không tìm thấy token đăng nhập!");
      return;
    }

    if (
      !teacherName.trim() ||
      !teacherPhone.trim() ||
      !teacherAddress.trim() ||
      !qualifications.trim()
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setIsLoading(true);
    try {
      const updateDto = {
        teacherName: teacherName.trim(),
        teacherPhone: teacherPhone.trim(),
        teacherAddress: teacherAddress.trim(),
        accountEmail: accountEmail.trim(),
        dateOfBirth,
        teacherGender,
        qualifications: qualifications.trim(),
      };

      const result = await authApi.updateTeacherDetail(token, updateDto);

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

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate.toISOString().split("T")[0]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cập nhật thông tin</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Thông tin giáo viên</Text>

          <View style={styles.inputRow}>
            <Ionicons
              name="person-outline"
              size={22}
              color="#4DB6AC"
              style={styles.iconStyle}
            />
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={teacherName}
              onChangeText={setTeacherName}
            />
          </View>

          <View style={styles.inputRow}>
            <Ionicons
              name="call-outline"
              size={22}
              color="#4DB6AC"
              style={styles.iconStyle}
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={teacherPhone}
              onChangeText={setTeacherPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputRow}>
            <Ionicons
              name="location-outline"
              size={22}
              color="#4DB6AC"
              style={styles.iconStyle}
            />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={teacherAddress}
              onChangeText={setTeacherAddress}
              multiline
            />
          </View>

          <View style={styles.inputRow}>
            <Ionicons
              name="mail-outline"
              size={22}
              color="#4DB6AC"
              style={styles.iconStyle}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={accountEmail}
              onChangeText={setAccountEmail}
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons
              name="calendar-outline"
              size={22}
              color="#4DB6AC"
              style={styles.iconStyle}
            />
            <View style={styles.dateInput}>
              <Text
                style={[
                  styles.input,
                  { color: dateOfBirth ? "#fff" : "rgba(255,255,255,0.7)" },
                ]}
              >
                {dateOfBirth || "Ngày sinh"}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.genderRow}>
            <Ionicons
              name="person-outline"
              size={22}
              color="#4DB6AC"
              style={styles.iconStyle}
            />
            <Text style={styles.genderLabel}>Giới tính:</Text>
            <TouchableOpacity
              style={[
                styles.genderButton,
                !teacherGender && styles.genderButtonActive,
              ]}
              onPress={() => setTeacherGender(false)}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  !teacherGender && styles.genderButtonTextActive,
                ]}
              >
                Nữ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                teacherGender && styles.genderButtonActive,
              ]}
              onPress={() => setTeacherGender(true)}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  teacherGender && styles.genderButtonTextActive,
                ]}
              >
                Nam
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <Ionicons
              name="school-outline"
              size={22}
              color="#4DB6AC"
              style={styles.iconStyle}
            />
            <TextInput
              style={styles.input}
              placeholder="Bằng cấp/Chuyên môn"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={qualifications}
              onChangeText={setQualifications}
              multiline
            />
          </View>

          <TouchableOpacity
            style={[styles.updateButton, isLoading && styles.disabledButton]}
            onPress={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Cập nhật thông tin</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4DB6AC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#4DB6AC",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    minHeight: 50,
  },
  iconStyle: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 15,
  },
  dateInput: {
    flex: 1,
    justifyContent: "center",
  },
  genderRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    minHeight: 50,
  },
  genderLabel: {
    color: "#fff",
    fontSize: 16,
    marginRight: 15,
  },
  genderButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  genderButtonActive: {
    backgroundColor: "#fff",
  },
  genderButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  genderButtonTextActive: {
    color: "#4DB6AC",
  },
  updateButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  updateButtonText: {
    color: "#4DB6AC",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UpdateTeacherPage;
