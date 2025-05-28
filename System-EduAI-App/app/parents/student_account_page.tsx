import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Student type matching backend StudentUserDetailDto
type Student = {
  studentName: string;
  studentPhone: string;
  studentAddress: string;
  accountEmail: string;
  dateOfBirth: string;
  studentGender: boolean;
  height: number;
  weight: number;
  classroomName: string;
  parentName: string;
  parentPhone: string;
  username?: string;
};

const StudentAccountPage = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { token, logout } = useAuth();

  // Fetch student data function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let studentData: Student | null = null;
      if (token) {
        console.log("Fetching student data with token");
        const apiData = await authApi.getStudentDetail(token);
        if (apiData) {
          studentData = {
            studentName: apiData.studentName || "",
            studentPhone: apiData.studentPhone || "",
            studentAddress: apiData.studentAddress || "",
            accountEmail: apiData.accountEmail || "",
            dateOfBirth: apiData.dateOfBirth || "",
            studentGender:
              apiData.studentGender !== undefined
                ? apiData.studentGender
                : false,
            height: apiData.height || 0,
            weight: apiData.weight || 0,
            classroomName: apiData.classroomName || "",
            parentName: apiData.parentName || "",
            parentPhone: apiData.parentPhone || "",
            username: apiData.username,
          };
        }
      }

      if (!studentData) {
        console.log("No student data available");
        Alert.alert("Lỗi", "Không thể tải thông tin học sinh.");
      }

      setStudent(studentData);
    } catch (error) {
      console.error("Error fetching student data:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu học sinh.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Load data when component mounts or token changes
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, [fetchData]);

  const handleLogout = () => {
    Alert.alert(
      "Đăng Xuất",
      "Bạn có muốn đăng xuất không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          onPress: async () => {
            await logout();
            router.replace("/");
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size={32} color="#4DB6AC" />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>Không có dữ liệu học sinh</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông Tin Học Sinh</Text>
      </View>

      <View style={styles.content}>
        <View style={{ padding: 20 }}>
          {/* Profile Section */}
          <View style={styles.profileContainer}>
            <Image
              source={
                student.studentGender
                  ? require("../../assets/images/teacher.png")
                  : require("../../assets/images/teacher.png")
              }
              style={styles.profileImage}
              defaultSource={require("../../assets/images/teacher.png")}
            />
            <Text style={styles.profileName}>{student.studentName}</Text>
            <Text style={styles.profileClass}>
              Lớp: {student.classroomName}
            </Text>
            <View style={styles.measurementRow}>
              <View style={styles.measurementItem}>
                <Text style={styles.measurementLabel}>Chiều cao</Text>
                <Text style={styles.measurementValue}>{student.height} cm</Text>
              </View>
              <View style={styles.measurementItem}>
                <Text style={styles.measurementLabel}>Cân nặng</Text>
                <Text style={styles.measurementValue}>{student.weight} kg</Text>
              </View>
            </View>
          </View>

          {/* Student Information Card */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Thông Tin Học Sinh</Text>

            <View style={styles.row}>
              <Ionicons name="person" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Họ Tên:</Text>
              <Text style={styles.value}>{student.studentName}</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="call" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Số Điện Thoại:</Text>
              <Text style={styles.value}>{student.studentPhone}</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="home" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Địa Chỉ:</Text>
              <Text style={styles.value}>{student.studentAddress}</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="mail" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{student.accountEmail}</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="calendar" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Ngày Sinh:</Text>
              <Text style={styles.value}>{student.dateOfBirth}</Text>
            </View>

            <View style={styles.row}>
              <Ionicons
                name={student.studentGender ? "male" : "female"}
                size={20}
                color="#4DB6AC"
              />
              <Text style={styles.label}>Giới Tính:</Text>
              <Text style={styles.value}>
                {student.studentGender ? "Nam" : "Nữ"}
              </Text>
            </View>

            <View style={{ marginTop: 16 }}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/parents/update_student_page",
                    params: {
                      studentName: student.studentName,
                      studentPhone: student.studentPhone,
                      studentAddress: student.studentAddress,
                      accountEmail: student.accountEmail,
                      dateOfBirth: student.dateOfBirth,
                      studentGender: student.studentGender.toString(),
                      parentName: student.parentName,
                      parentPhone: student.parentPhone,
                    },
                  })
                }
              >
                <Text style={styles.updateLink}>Cập Nhật Thông Tin</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Parent Information Card */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Thông Tin Phụ Huynh</Text>

            <View style={styles.row}>
              <Ionicons name="person" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Họ Tên:</Text>
              <Text style={styles.value}>{student.parentName}</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="call" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Số Điện Thoại:</Text>
              <Text style={styles.value}>{student.parentPhone}</Text>
            </View>
          </View>

          {/* Measurements Update Section */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Cập Nhật Số Đo</Text>
            <TouchableOpacity
              style={styles.measurementUpdateButton}
              onPress={() =>
                router.push({
                  pathname: "/parents/update_measurements_page",
                  params: {
                    currentHeight: student.height.toString(),
                    currentWeight: student.weight.toString(),
                    studentName: student.studentName,
                  },
                })
              }
            >
              <Ionicons name="body" size={20} color="#fff" />
              <Text style={styles.measurementUpdateText}>
                Cập Nhật Chiều Cao & Cân Nặng
              </Text>
            </TouchableOpacity>
          </View>

          {/* Health Tracking Section */}
          <TouchableOpacity
            style={styles.healthButton}
            onPress={() =>
              router.push({
                pathname: "/teachers/medicine_page",
                params: {
                  childId: "1", // Use actual student ID
                  childName: student.studentName,
                },
              })
            }
          >
            <Ionicons name="fitness" size={24} color="#e53935" />
            <Text style={styles.healthButtonText}>Theo Dõi Sức Khỏe</Text>
          </TouchableOpacity>

          {/* Logout Section */}
          <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#4DB6AC" />
            <Text style={styles.logoutText}>Đăng Xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  noDataText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#4DB6AC",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
  profileContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0f2f1",
    borderWidth: 3,
    borderColor: "#4DB6AC",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
    color: "#333",
  },
  profileClass: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  measurementRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 20,
  },
  measurementItem: {
    alignItems: "center",
    backgroundColor: "#e0f7fa",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  measurementLabel: {
    fontSize: 12,
    color: "#666",
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00796B",
  },
  infoCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    marginLeft: 8,
    marginRight: 8,
    color: "#333",
    minWidth: 100,
    paddingTop: 2,
  },
  value: {
    color: "#333",
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  updateLink: {
    color: "#00796B",
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 16,
    textAlign: "center",
  },
  measurementUpdateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00796B",
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  measurementUpdateText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  healthButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: "center",
    gap: 12,
  },
  healthButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e53935",
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    paddingBottom: 20,
  },
  logoutText: {
    color: "#4DB6AC",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 16,
  },
});

export default StudentAccountPage;
