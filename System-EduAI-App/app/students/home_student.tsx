import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Import hooks
import { useStudent } from "../hooks/useStudent";
import { useClass } from "../hooks/useClass";
import { useNotifications } from "../hooks/useNotifications";

// Import từ file services
import { publicApi, isUsingMockMode, getCurrentMode } from "../services/api";
import MenuDrawer from "../components/MenuDrawer";

// Sử dụng lại logic từ home_parent.tsx nhưng tùy chỉnh cho student
const HomeStudent = () => {
  // Use hooks to fetch data
  const {
    student,
    isLoading: studentLoading,
    error: studentError,
    refetch: refetchStudent,
  } = useStudent();
  const { classInf, isLoading: classLoading } = useClass();
  const { notifications, isLoading: notificationsLoading } = useNotifications();

  const [networkError, setNetworkError] = useState<string | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const isLoading = studentLoading || classLoading || notificationsLoading;

  const handleNavigationWithConnection = async (
    path: string,
    requiresConnection = true
  ) => {
    if (requiresConnection) {
      try {
        const isConnected = await publicApi.testConnection();
        if (!isConnected) {
          Alert.alert(
            "Lỗi kết nối",
            "Không thể truy cập tính năng này. Vui lòng kiểm tra kết nối mạng."
          );
          return;
        }
      } catch (error) {
        Alert.alert("Lỗi", "Có vấn đề với kết nối mạng. Vui lòng thử lại.");
        return;
      }
    }

    router.push(path as any);
  };

  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        const isConnected = await publicApi.testConnection();
        if (!isConnected) {
          setNetworkError(
            "Kết nối mạng không ổn định. Một số tính năng có thể bị giới hạn."
          );
        } else {
          setNetworkError(null);
        }
      } catch (error) {
        setNetworkError("Không thể kiểm tra trạng thái mạng.");
      }
    };

    checkNetworkStatus();
  }, []);

  // Format date of birth for display
  const formatDateOfBirth = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  // Format gender for display
  const formatGender = (gender: boolean) => {
    return gender ? "Nam" : "Nữ";
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4DB6AC" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#666" }}>
          Đang tải thông tin...
        </Text>
      </View>
    );
  }

  if (studentError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <MaterialIcons name="error-outline" size={48} color="#f44336" />
        <Text
          style={{
            marginTop: 10,
            fontSize: 16,
            color: "#f44336",
            textAlign: "center",
          }}
        >
          {studentError}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetchStudent}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // In the navigation handler, make sure to pass these fields to the update page
  const navigateToUpdatePage = () => {
    try {
      router.push({
        pathname: "/students/update_student_page",
        params: {
          studentName: student.studentName,
          studentPhone: student.studentPhone,
          studentAddress: student.studentAddress,
          accountEmail: student.accountEmail,
          dateOfBirth: student.dateOfBirth,
          studentGender: student.studentGender.toString(),
          parentName: student.parentName,
          parentPhone: student.parentPhone,
          healthStatus: student.healthStatus || "Healthy", // Ensure we always pass a value
          hobby: student.hobby || "None", // Ensure we always pass a value
        },
      });
    } catch (error) {
      console.warn("Navigation error:", error);
      Alert.alert("Lỗi", "Không thể mở trang chỉnh sửa thông tin học sinh");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {networkError && (
        <View style={styles.networkErrorBanner}>
          <Text style={styles.networkErrorText}>{networkError}</Text>
        </View>
      )}

      {/* Header */}
      <ImageBackground
        source={require("../../assets/images/background.png")}
        style={styles.headerBg}
        imageStyle={styles.headerImage}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setIsDrawerVisible(true)}>
            <MaterialIcons name="menu" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trang Học Sinh</Text>
          <View style={styles.notificationWrapper}>
            <TouchableOpacity
              onPress={() =>
                handleNavigationWithConnection(
                  "/teachers/notification_page",
                  true
                )
              }
            >
              <MaterialIcons
                name="notifications-active"
                size={30}
                color="white"
              />
            </TouchableOpacity>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>
                {notifications?.length || 0}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.eventBox}>
          <View style={styles.eventRow}>
            <View>
              <Text style={styles.eventTitle}>Chào mừng học sinh!</Text>
              <Text style={styles.eventSubtitle}>
                Khám phá thế giới học tập
              </Text>
              <View style={styles.eventInfoRow}>
                <Text style={styles.eventInfoLabel}>Hôm nay: </Text>
                <Text style={styles.eventInfoValue}>
                  {new Date().toLocaleDateString("vi-VN")}
                </Text>
              </View>
            </View>
            <MaterialIcons name="school" size={25} color="white" />
          </View>
        </View>
      </ImageBackground>

      {/* Body */}
      <View style={styles.body}>
        {/* Navigation Buttons cho Student */}
        <View style={styles.navBox}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() =>
              handleNavigationWithConnection(
                "/parents/student_account_page",
                true
              )
            }
            activeOpacity={0.7}
          >
            <View style={styles.navIconBox}>
              <MaterialIcons name="person" size={24} color="#00695C" />
            </View>
            <Text style={styles.navText}>Hồ Sơ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() =>
              handleNavigationWithConnection("/teachers/medicine_page", true)
            }
            activeOpacity={0.7}
          >
            <View style={styles.navIconBox}>
              <MaterialIcons name="favorite" size={24} color="#00695C" />
            </View>
            <Text style={styles.navText}>Sức Khỏe</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() =>
              handleNavigationWithConnection("/teachers/album", true)
            }
            activeOpacity={0.7}
          >
            <View style={styles.navIconBox}>
              <MaterialIcons name="photo" size={24} color="#00695C" />
            </View>
            <Text style={styles.navText}>Album</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() =>
              handleNavigationWithConnection("/parents/message_parent", true)
            }
            activeOpacity={0.7}
          >
            <View style={styles.navIconBox}>
              <MaterialIcons name="message" size={24} color="#00695C" />
            </View>
            <Text style={styles.navText}>Tin Nhắn</Text>
          </TouchableOpacity>
        </View>

        {/* Student Info - Enhanced with detailed information */}
        <View style={styles.studentInfoBox}>
          <TouchableOpacity
            style={styles.studentInfoButton}
            onPress={() => {
              try {
                router.push("/parents/student_account_page");
              } catch (error) {
                console.warn("Navigation error:", error);
                Alert.alert("Lỗi", "Không thể mở trang thông tin học sinh");
              }
            }}
            activeOpacity={0.7}
          >
            <View style={styles.studentInfoHeader}>
              <Image
                source={require("../../assets/images/teacher.png")}
                style={styles.studentAvatar}
                defaultSource={require("../../assets/images/teacher.png")}
              />
              <View style={styles.studentBasicInfo}>
                <Text style={styles.studentName}>
                  {student?.studentName || "Đang tải..."}
                </Text>
                <Text style={styles.studentClass}>
                  Lớp:{" "}
                  {student?.classroomName || classInf?.name || "Đang tải..."}
                </Text>
                <Text style={styles.studentRole}>Học sinh</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>

            {/* Detailed Student Information */}
            {student && (
              <View style={styles.studentDetails}>
                <View style={styles.studentDetailRow}>
                  <MaterialIcons name="phone" size={16} color="#4DB6AC" />
                  <Text style={styles.studentDetailLabel}>SĐT:</Text>
                  <Text style={styles.studentDetailValue} numberOfLines={1}>
                    {student.studentPhone || "Chưa cập nhật"}
                  </Text>
                </View>

                <View style={styles.studentDetailRow}>
                  <MaterialIcons name="email" size={16} color="#4DB6AC" />
                  <Text style={styles.studentDetailLabel}>Email:</Text>
                  <Text style={styles.studentDetailValue} numberOfLines={1}>
                    {student.accountEmail || "Chưa cập nhật"}
                  </Text>
                </View>

                <View style={styles.studentDetailRow}>
                  <MaterialIcons name="home" size={16} color="#4DB6AC" />
                  <Text style={styles.studentDetailLabel}>Địa chỉ:</Text>
                  <Text style={styles.studentDetailValue} numberOfLines={2}>
                    {student.studentAddress || "Chưa cập nhật"}
                  </Text>
                </View>

                <View style={styles.studentDetailRow}>
                  <MaterialIcons name="cake" size={16} color="#4DB6AC" />
                  <Text style={styles.studentDetailLabel}>Sinh nhật:</Text>
                  <Text style={styles.studentDetailValue}>
                    {formatDateOfBirth(student.dateOfBirth) || "Chưa cập nhật"}
                  </Text>
                </View>

                <View style={styles.studentDetailRow}>
                  <MaterialIcons
                    name={student.studentGender ? "male" : "female"}
                    size={16}
                    color="#4DB6AC"
                  />
                  <Text style={styles.studentDetailLabel}>Giới tính:</Text>
                  <Text style={styles.studentDetailValue}>
                    {formatGender(student.studentGender)}
                  </Text>
                </View>

                <View style={styles.studentDetailRow}>
                  <MaterialIcons name="straighten" size={16} color="#4DB6AC" />
                  <Text style={styles.studentDetailLabel}>Chiều cao:</Text>
                  <Text style={styles.studentDetailValue}>
                    {student.height ? `${student.height} cm` : "Chưa cập nhật"}
                  </Text>
                </View>

                <View style={styles.studentDetailRow}>
                  <MaterialIcons
                    name="monitor-weight"
                    size={16}
                    color="#4DB6AC"
                  />
                  <Text style={styles.studentDetailLabel}>Cân nặng:</Text>
                  <Text style={styles.studentDetailValue}>
                    {student.weight ? `${student.weight} kg` : "Chưa cập nhật"}
                  </Text>
                </View>

                <View style={styles.studentDetailRow}>
                  <MaterialIcons
                    name="family-restroom"
                    size={16}
                    color="#4DB6AC"
                  />
                  <Text style={styles.studentDetailLabel}>Phụ huynh:</Text>
                  <Text style={styles.studentDetailValue}>
                    {student.parentName || "Chưa cập nhật"}
                  </Text>
                </View>

                <View style={styles.studentDetailRow}>
                  <MaterialIcons
                    name="contact-phone"
                    size={16}
                    color="#4DB6AC"
                  />
                  <Text style={styles.studentDetailLabel}>SĐT PH:</Text>
                  <Text style={styles.studentDetailValue}>
                    {student.parentPhone || "Chưa cập nhật"}
                  </Text>
                </View>

                {student.username && (
                  <View style={styles.studentDetailRow}>
                    <MaterialIcons
                      name="account-circle"
                      size={16}
                      color="#4DB6AC"
                    />
                    <Text style={styles.studentDetailLabel}>Tài khoản:</Text>
                    <Text style={styles.studentDetailValue}>
                      {student.username}
                    </Text>
                  </View>
                )}

                {/* Add Health Status Detail */}
                <View style={styles.studentDetailRow}>
                  <MaterialIcons name="favorite" size={16} color="#4DB6AC" />
                  <Text style={styles.studentDetailLabel}>Sức khỏe:</Text>
                  <Text style={styles.studentDetailValue}>
                    {student?.healthStatus || "Chưa cập nhật"}
                  </Text>
                </View>

                {/* Add Hobby Detail */}
                <View style={styles.studentDetailRow}>
                  <MaterialIcons
                    name="sports-basketball"
                    size={16}
                    color="#4DB6AC"
                  />
                  <Text style={styles.studentDetailLabel}>Sở thích:</Text>
                  <Text style={styles.studentDetailValue}>
                    {student?.hobby || "Chưa cập nhật"}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.studentInfoFooter}>
              <Text style={styles.studentInfoFooterText}>
                Nhấn để xem chi tiết và cập nhật thông tin
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Learning Activities Section */}
        <View style={styles.activitiesSection}>
          <Text style={styles.sectionTitle}>Hoạt động học tập</Text>

          <TouchableOpacity
            style={styles.activityCard}
            onPress={() =>
              handleNavigationWithConnection("/teachers/post_page", true)
            }
          >
            <MaterialIcons name="book" size={40} color="#4DB6AC" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Bài học hôm nay</Text>
              <Text style={styles.activitySubtitle}>
                Khám phá kiến thức mới
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.activityCard}
            onPress={() =>
              handleNavigationWithConnection("/teachers/album", true)
            }
          >
            <MaterialIcons name="assignment" size={40} color="#4DB6AC" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Bài tập</Text>
              <Text style={styles.activitySubtitle}>
                Hoàn thành bài tập được giao
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.activityCard}
            onPress={() =>
              handleNavigationWithConnection("/teachers/medicine_page", true)
            }
          >
            <MaterialIcons name="health-and-safety" size={40} color="#4DB6AC" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Theo dõi sức khỏe</Text>
              <Text style={styles.activitySubtitle}>
                Xem thông tin dinh dưỡng và sức khỏe
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Class Information Section */}
        <View style={styles.classInfoSection}>
          <Text style={styles.sectionTitle}>Thông tin lớp học</Text>

          <View style={styles.classInfoCard}>
            <View style={styles.classInfoHeader}>
              <MaterialIcons name="class" size={24} color="#4DB6AC" />
              <Text style={styles.classInfoTitle}>
                {student?.classroomName || classInf?.name || "Lớp Mầm"}
              </Text>
            </View>

            <View style={styles.classInfoDetails}>
              <View style={styles.classInfoRow}>
                <MaterialIcons name="people" size={16} color="#666" />
                <Text style={styles.classInfoLabel}>Sĩ số:</Text>
                <Text style={styles.classInfoValue}>25 học sinh</Text>
              </View>

              <View style={styles.classInfoRow}>
                <MaterialIcons name="schedule" size={16} color="#666" />
                <Text style={styles.classInfoLabel}>Thời gian:</Text>
                <Text style={styles.classInfoValue}>7:30 - 16:30</Text>
              </View>

              <View style={styles.classInfoRow}>
                <MaterialIcons name="location-on" size={16} color="#666" />
                <Text style={styles.classInfoLabel}>Phòng học:</Text>
                <Text style={styles.classInfoValue}>A101</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Menu Drawer */}
      <MenuDrawer
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        userRole="student"
        userName={student?.studentName}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6fafd" },
  networkErrorBanner: {
    backgroundColor: "#ffeb3b",
    padding: 10,
    margin: 16,
    borderRadius: 8,
  },
  networkErrorText: {
    color: "#333",
    textAlign: "center",
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: "#4DB6AC",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerBg: {
    padding: 0,
    paddingBottom: 50,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerImage: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationWrapper: { position: "relative" },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  notificationText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  eventBox: {
    marginTop: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eventTitle: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  eventSubtitle: { color: "#fff", fontSize: 13, marginBottom: 2 },
  eventInfoRow: { flexDirection: "row", marginTop: 2 },
  eventInfoLabel: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  eventInfoValue: { color: "#fff", fontSize: 13 },
  body: { paddingHorizontal: 0, paddingTop: 0, paddingBottom: 16 },
  navBox: {
    backgroundColor: "#fff",
    borderRadius: 24,
    elevation: 2,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginTop: -32,
    zIndex: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
  },
  navIconBox: {
    backgroundColor: "#e0f7fa",
    padding: 12,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    marginTop: -24,
    borderWidth: 3,
    borderColor: "#fff",
    minWidth: 48,
    minHeight: 48,
  },
  navText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 2,
    color: "#1A3442",
    textAlign: "center",
  },
  studentInfoBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 2,
    padding: 16,
    marginTop: 24,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  studentInfoButton: {
    width: "100%",
  },
  studentInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  studentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#4DB6AC",
  },
  studentBasicInfo: {
    flex: 1,
    marginLeft: 12,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A3442",
    marginBottom: 2,
  },
  studentClass: {
    fontSize: 14,
    color: "#4DB6AC",
    fontWeight: "600",
  },
  studentRole: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  studentDetails: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
  },
  studentDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 2,
  },
  studentDetailLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginLeft: 8,
    minWidth: 70,
  },
  studentDetailValue: {
    fontSize: 13,
    color: "#475569",
    flex: 1,
    marginLeft: 4,
  },
  studentInfoFooter: {
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  studentInfoFooterText: {
    fontSize: 12,
    color: "#64748b",
    fontStyle: "italic",
  },
  activitiesSection: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A3442",
    marginBottom: 12,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  activityContent: {
    flex: 1,
    marginLeft: 16,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A3442",
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: "#666",
  },
  classInfoSection: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  classInfoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  classInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  classInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A3442",
    marginLeft: 8,
  },
  classInfoDetails: {
    marginLeft: 32,
  },
  classInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  classInfoLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    minWidth: 80,
  },
  classInfoValue: {
    fontSize: 14,
    color: "#1A3442",
    fontWeight: "500",
  },
});

export default HomeStudent;
