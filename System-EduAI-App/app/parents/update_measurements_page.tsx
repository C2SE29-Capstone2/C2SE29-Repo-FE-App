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

const UpdateMeasurementsPage = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { token } = useAuth();

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    // Load data from params
    if (params.currentHeight) setHeight(params.currentHeight as string);
    if (params.currentWeight) setWeight(params.currentWeight as string);
    if (params.studentName) setStudentName(params.studentName as string);
  }, [params]);

  const handleUpdate = async () => {
    // Validate required fields
    if (!height || !weight) {
      Alert.alert(
        "Lỗi",
        "Vui lòng nhập đầy đủ thông tin chiều cao và cân nặng!"
      );
      return;
    }

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    // Validate numbers
    if (isNaN(heightNum) || isNaN(weightNum)) {
      Alert.alert("Lỗi", "Chiều cao và cân nặng phải là số!");
      return;
    }

    // Validate reasonable ranges
    if (heightNum < 30 || heightNum > 200) {
      Alert.alert("Lỗi", "Chiều cao không hợp lệ (30-200 cm)!");
      return;
    }

    if (weightNum < 1 || weightNum > 100) {
      Alert.alert("Lỗi", "Cân nặng không hợp lệ (1-100 kg)!");
      return;
    }

    setIsUpdating(true);
    try {
      const measurementDto = {
        height: heightNum,
        weight: weightNum,
      };

      let updatedSuccess = false;
      if (token) {
        console.log("Updating measurements with real API", measurementDto);
        const updated = await authApi.updateStudentMeasurements(
          token,
          measurementDto
        );
        if (updated) {
          updatedSuccess = true;
          Alert.alert("Thành công", "Cập nhật số đo thành công!");
        } else {
          Alert.alert("Lỗi", "Cập nhật thất bại từ API! Vui lòng thử lại.");
        }
      } else {
        console.log("Simulating measurements update (no token)");
        updatedSuccess = true;
        Alert.alert("Thành công", "Cập nhật số đo thành công! (Mô phỏng)");
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
      console.error("Error updating measurements:", error);
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
        <Text style={styles.headerTitle}>Cập Nhật Số Đo</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.studentInfo}>
            <Ionicons name="person" size={40} color="#4DB6AC" />
            <Text style={styles.studentName}>{studentName}</Text>
          </View>

          <Text style={styles.sectionTitle}>Thông Tin Số Đo</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chiều cao (cm) *</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="Nhập chiều cao (VD: 100.5)"
              keyboardType="numeric"
            />
            <Text style={styles.hint}>Từ 30 đến 200 cm</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cân nặng (kg) *</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="Nhập cân nặng (VD: 15.5)"
              keyboardType="numeric"
            />
            <Text style={styles.hint}>Từ 1 đến 100 kg</Text>
          </View>

          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Xem trước:</Text>
            <View style={styles.previewRow}>
              <View style={styles.previewItem}>
                <Ionicons name="resize" size={24} color="#4DB6AC" />
                <Text style={styles.previewLabel}>Chiều cao</Text>
                <Text style={styles.previewValue}>{height || "0"} cm</Text>
              </View>
              <View style={styles.previewItem}>
                <Ionicons name="fitness" size={24} color="#4DB6AC" />
                <Text style={styles.previewLabel}>Cân nặng</Text>
                <Text style={styles.previewValue}>{weight || "0"} kg</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.updateButton, isUpdating && styles.disabledButton]}
            onPress={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>CẬP NHẬT SỐ ĐO</Text>
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
  studentInfo: {
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 20,
  },
  studentName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
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
  hint: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  previewContainer: {
    backgroundColor: "#e0f7fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  previewItem: {
    alignItems: "center",
  },
  previewLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  previewValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796B",
    marginTop: 4,
  },
  updateButton: {
    backgroundColor: "#4DB6AC",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
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

export default UpdateMeasurementsPage;
