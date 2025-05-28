import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Create local interfaces since the health types import might not exist
interface HealthInfoDTO {
  studentId: number;
  bloodType?: string;
  allergies?: string;
  currentWeight?: number;
  currentHeight?: number;
  healthCondition?: string;
  notes?: string;
  medications?: string;
  medicalHistory?: string;
  emergencyContact?: string;
  doctorNotes?: string;
}

interface GrowthChartDataPoint {
  date: string;
  height: number;
  weight: number;
  label?: string;
  value?: number;
}

interface Student {
  id: string;
  name: string;
}

// Add simple chart component as replacement
const SimpleChart = ({ data, title }: { data: any[]; title: string }) => {
  const maxValue = Math.max(...data.map((d) => d.value || 0));

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartBars}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  height: maxValue > 0 ? (item.value / maxValue) * 100 : 0,
                  backgroundColor: "#4DB6AC",
                },
              ]}
            />
            <Text style={styles.barLabel}>{item.label}</Text>
            <Text style={styles.barValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const HealthPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { token } = useAuth();

  const [student, setStudent] = useState<Student | null>(null);
  const [healthInfo, setHealthInfo] = useState<HealthInfoDTO | null>(null);
  const [chartData, setChartData] = useState<GrowthChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false); // New state

  const studentIdFromParams = params.studentId as string;
  const studentNameFromParams = params.studentName as string;

  useEffect(() => {
    // Example: studentId could be passed from a student list or a default.
    // For now, using "1" as a fallback if not passed via params.
    const currentStudentId = studentIdFromParams || "1"; // Default or ensure it's passed
    const currentStudentName = studentNameFromParams || "Chưa chọn HS";

    setStudent({
      id: currentStudentId,
      name: currentStudentName,
    });

    fetchHealthData(currentStudentId);
  }, [studentIdFromParams, studentNameFromParams]);

  const fetchHealthData = async (studentId: string) => {
    if (!token) {
      Alert.alert("Lỗi", "Không tìm thấy token đăng nhập!");
      return;
    }

    try {
      setIsLoading(true);

      // Mock data for demonstration
      const mockChartData = [
        { label: "T1", value: 15 },
        { label: "T2", value: 16 },
        { label: "T3", value: 17 },
        { label: "T4", value: 18 },
        { label: "T5", value: 19 },
        { label: "T6", value: 20 },
      ];

      setChartData(mockChartData);

      // Try to fetch real data from API
      const healthData = await authApi.getHealthRecord(
        token,
        parseInt(studentId)
      );
      if (healthData) {
        setHealthInfo(healthData);
        setBloodType(healthData.bloodType || "");
        setAllergies(healthData.allergies || "");
        setMedicalConditions(healthData.healthCondition || "");
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu sức khỏe");
    } finally {
      setIsLoading(false);
      setIsInitialLoadComplete(true);
    }
  };

  const handleSaveHealthInfo = async () => {
    if (!token || !student) {
      Alert.alert("Lỗi", "Thiếu thông tin cần thiết!");
      return;
    }

    try {
      const healthInfoDTO: HealthInfoDTO = {
        studentId: parseInt(student.id),
        bloodType,
        allergies,
        healthCondition: medicalConditions,
        emergencyContact: emergencyContactName + " - " + emergencyContactPhone,
      };

      const result = await authApi.createOrUpdateHealthRecord(
        token,
        healthInfoDTO
      );
      if (result) {
        Alert.alert("Thành công", "Cập nhật thông tin sức khỏe thành công!");
        setHealthInfo(result);
      } else {
        Alert.alert("Lỗi", "Không thể lưu thông tin sức khỏe!");
      }
    } catch (error) {
      console.error("Error saving health info:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi lưu thông tin!");
    }
  };

  if (isLoading && !isInitialLoadComplete) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4DB6AC" />
        <Text style={styles.loadingText}>Đang tải dữ liệu sức khỏe...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sức Khỏe - {student?.name}</Text>
        <TouchableOpacity onPress={() => fetchHealthData(student?.id || "1")}>
          <Ionicons name="refresh" size={25} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Health Information Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông Tin Sức Khỏe</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nhóm máu:</Text>
          <TextInput
            style={styles.textInput}
            value={bloodType}
            onChangeText={setBloodType}
            placeholder="Nhập nhóm máu (A, B, AB, O)"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Dị ứng:</Text>
          <TextInput
            style={styles.textInput}
            value={allergies}
            onChangeText={setAllergies}
            placeholder="Nhập thông tin dị ứng"
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Tình trạng sức khỏe:</Text>
          <TextInput
            style={styles.textInput}
            value={medicalConditions}
            onChangeText={setMedicalConditions}
            placeholder="Nhập tình trạng sức khỏe"
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Liên hệ khẩn cấp:</Text>
          <TextInput
            style={styles.textInput}
            value={emergencyContactName}
            onChangeText={setEmergencyContactName}
            placeholder="Tên người liên hệ"
          />
          <TextInput
            style={[styles.textInput, { marginTop: 8 }]}
            value={emergencyContactPhone}
            onChangeText={setEmergencyContactPhone}
            placeholder="Số điện thoại khẩn cấp"
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveHealthInfo}
        >
          <Text style={styles.saveButtonText}>Lưu Thông Tin</Text>
        </TouchableOpacity>
      </View>

      {/* Growth Chart Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Biểu Đồ Tăng Trưởng</Text>
        <SimpleChart data={chartData} title="Chiều cao theo tháng (cm)" />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thao Tác Nhanh</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/teachers/medicine_page")}
        >
          <Ionicons name="medical-outline" size={24} color="#4DB6AC" />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Quản Lý Y Tế</Text>
            <Text style={styles.actionSubtitle}>
              Hồ sơ sức khỏe, tiêm chủng
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="nutrition-outline" size={24} color="#4DB6AC" />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Dinh Dưỡng</Text>
            <Text style={styles.actionSubtitle}>
              Thực đơn, theo dõi ăn uống
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    height: 100,
    backgroundColor: "#4DB6AC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f8fafc",
  },
  saveButton: {
    backgroundColor: "#4DB6AC",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  chartContainer: {
    marginVertical: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#333",
  },
  chartBars: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 120,
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: 20,
    backgroundColor: "#4DB6AC",
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  barValue: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  actionContent: {
    marginLeft: 12,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  actionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});

export default HealthPage;
