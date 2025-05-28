import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Import hooks
import { useTeacher } from "../hooks/useTeacher";
import { useClass } from "../hooks/useClass";
import { useNotifications } from "../hooks/useNotifications";

// Import từ file services
import { publicApi, isUsingMockMode, getCurrentMode } from "../services/api";
import MenuDrawer from "../components/MenuDrawer";

// Types
type Post = {
  id: string;
  image: any;
  title: string;
  subtitle: string;
  tag: string;
};

interface HomeScreenProps {
  navigation?: any;
}

// Main HomeScreen
function HomeScreen({ navigation }: HomeScreenProps) {
  // Use hooks to fetch data
  const {
    teacher,
    isLoading: teacherLoading,
    error: teacherError,
    refetch: refetchTeacher,
  } = useTeacher();
  const { classInf, isLoading: classLoading } = useClass();
  const { notifications, isLoading: notificationsLoading } = useNotifications();

  const [networkError, setNetworkError] = useState<string | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("");

  // Check connection status
  useEffect(() => {
    const checkStatus = () => {
      const status = getCurrentMode();
      setConnectionStatus(status);
    };

    checkStatus();
    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const isLoading = teacherLoading || classLoading || notificationsLoading;

  // Post data (mocked)
  const posts: Post[] = [
    {
      id: "1",
      image: require("../../assets/images/montess.png"),
      title: "Montess",
      subtitle: "Cho bé từ nhỏ đến lớn",
      tag: "Phương pháp Montess",
    },
    {
      id: "2",
      image: require("../../assets/images/support1.png"),
      title: "Ăn uống",
      subtitle: "Cho bé từ 1 đến 3 tuổi",
      tag: "Cách ăn uống",
    },
    {
      id: "3",
      image: require("../../assets/images/montess.png"),
      title: "Montess",
      subtitle: "Cho bé từ nhỏ đến lớn",
      tag: "Phương pháp Montess",
    },
  ];

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

    try {
      router.push(path as any);
    } catch (error) {
      console.warn("Navigation error:", error);
      Alert.alert("Lỗi", "Không thể chuyển trang. Vui lòng thử lại.");
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => {
        try {
          router.push("/teachers/post_page");
        } catch (error) {
          console.warn("Navigation error:", error);
        }
      }}
    >
      <Image source={item.image} style={styles.postImage} />
      <View style={{ flexDirection: "row", alignItems: "center", padding: 8 }}>
        <View style={styles.postTagBox}>
          <Text style={styles.postTagText}>{item.tag}</Text>
        </View>
        <Text style={styles.postDetailText}>Xem chi tiết</Text>
      </View>
    </TouchableOpacity>
  );

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

  if (teacherError) {
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
          {teacherError}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetchTeacher}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetchTeacher} />
      }
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => setIsDrawerVisible(true)}>
              <MaterialIcons name="menu" size={30} color="white" />
            </TouchableOpacity>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {isUsingMockMode() && (
                <View style={styles.mockIndicator}>
                  <Text style={styles.mockText}>DEMO</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => router.push("/teachers/notification_page")}
              >
                <MaterialIcons name="notifications" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Xin chào!</Text>
            <Text style={styles.teacherName}>
              {teacher ? teacher.teacherName : "Đang tải..."}
            </Text>
            {isUsingMockMode() && (
              <Text style={styles.demoNote}>Chế độ demo - Backend offline</Text>
            )}
          </View>
        </View>

        {/* Connection Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Trạng thái: {connectionStatus}</Text>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Navigation Buttons */}
          <View style={styles.navBox}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() =>
                handleNavigationWithConnection("/teachers/message_page", true)
              }
              activeOpacity={0.7}
            >
              <View style={styles.navIconBox}>
                <MaterialIcons name="message" size={24} color="#00695C" />
              </View>
              <Text style={styles.navText}>Nhắn Tin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() =>
                handleNavigationWithConnection("/teachers/medicine_page", true)
              }
              activeOpacity={0.7}
            >
              <View style={styles.navIconBox}>
                <MaterialIcons name="add-alert" size={24} color="#00695C" />
              </View>
              <Text style={styles.navText}>Dinh Dưỡng</Text>
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
                handleNavigationWithConnection("/teachers/comment", true)
              }
              activeOpacity={0.7}
            >
              <View style={styles.navIconBox}>
                <MaterialIcons name="article" size={24} color="#00695C" />
              </View>
              <Text style={styles.navText}>Nhận Xét</Text>
            </TouchableOpacity>
          </View>

          {/* Teacher Info - Enhanced with detailed information */}
          <View style={styles.teacherInfoBox}>
            <TouchableOpacity
              style={styles.teacherInfoButton}
              onPress={() => {
                try {
                  router.push("/teachers/account_page");
                } catch (error) {
                  console.warn("Navigation error:", error);
                  Alert.alert("Lỗi", "Không thể mở trang thông tin giáo viên");
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.teacherInfoHeader}>
                <Image
                  source={require("../../assets/images/teacher.png")}
                  style={styles.teacherAvatar}
                  defaultSource={require("../../assets/images/teacher.png")}
                />
                <View style={styles.teacherBasicInfo}>
                  <Text style={styles.teacherName}>
                    {teacher?.teacherName || "Đang tải..."}
                  </Text>
                  <Text style={styles.teacherClass}>
                    Lớp: {classInf?.name || "Đang tải..."}
                  </Text>
                  <Text style={styles.teacherRole}>Giáo viên chủ nhiệm</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </View>

              {/* Detailed Teacher Information */}
              {teacher && (
                <View style={styles.teacherDetails}>
                  <View style={styles.teacherDetailRow}>
                    <MaterialIcons name="phone" size={16} color="#4DB6AC" />
                    <Text style={styles.teacherDetailLabel}>SĐT:</Text>
                    <Text style={styles.teacherDetailValue} numberOfLines={1}>
                      {teacher.teacherPhone || "Chưa cập nhật"}
                    </Text>
                  </View>

                  <View style={styles.teacherDetailRow}>
                    <MaterialIcons name="email" size={16} color="#4DB6AC" />
                    <Text style={styles.teacherDetailLabel}>Email:</Text>
                    <Text style={styles.teacherDetailValue} numberOfLines={1}>
                      {teacher.accountEmail || "Chưa cập nhật"}
                    </Text>
                  </View>

                  <View style={styles.teacherDetailRow}>
                    <MaterialIcons name="home" size={16} color="#4DB6AC" />
                    <Text style={styles.teacherDetailLabel}>Địa chỉ:</Text>
                    <Text style={styles.teacherDetailValue} numberOfLines={2}>
                      {teacher.teacherAddress || "Chưa cập nhật"}
                    </Text>
                  </View>

                  <View style={styles.teacherDetailRow}>
                    <MaterialIcons name="cake" size={16} color="#4DB6AC" />
                    <Text style={styles.teacherDetailLabel}>Sinh nhật:</Text>
                    <Text style={styles.teacherDetailValue}>
                      {formatDateOfBirth(teacher.dateOfBirth) ||
                        "Chưa cập nhật"}
                    </Text>
                  </View>

                  <View style={styles.teacherDetailRow}>
                    <MaterialIcons
                      name={teacher.teacherGender ? "male" : "female"}
                      size={16}
                      color="#4DB6AC"
                    />
                    <Text style={styles.teacherDetailLabel}>Giới tính:</Text>
                    <Text style={styles.teacherDetailValue}>
                      {formatGender(teacher.teacherGender)}
                    </Text>
                  </View>

                  <View style={styles.teacherDetailRow}>
                    <MaterialIcons name="school" size={16} color="#4DB6AC" />
                    <Text style={styles.teacherDetailLabel}>Bằng cấp:</Text>
                    <Text style={styles.teacherDetailValue} numberOfLines={2}>
                      {teacher.qualifications || "Chưa cập nhật"}
                    </Text>
                  </View>

                  {teacher.username && (
                    <View style={styles.teacherDetailRow}>
                      <MaterialIcons
                        name="account-circle"
                        size={16}
                        color="#4DB6AC"
                      />
                      <Text style={styles.teacherDetailLabel}>Tài khoản:</Text>
                      <Text style={styles.teacherDetailValue}>
                        {teacher.username}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <View style={styles.teacherInfoFooter}>
                <Text style={styles.teacherInfoFooterText}>
                  Nhấn để xem chi tiết và cập nhật thông tin
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Posts Section */}
          <View style={styles.postsSection}>
            <View style={styles.postsHeader}>
              <Text style={styles.postsTitle}>Bài viết</Text>
              <TouchableOpacity
                onPress={() =>
                  handleNavigationWithConnection("/teachers/post_page", true)
                }
                activeOpacity={0.7}
              >
                <Text style={styles.postsSeeAll}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.postsFilterRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.postsFilterRow}
              >
                <TouchableOpacity
                  style={[styles.filterBtn, styles.filterBtnActive]}
                >
                  <Text style={styles.filterBtnActiveText}>Montess</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterBtn}>
                  <Text style={styles.filterBtnText}>Từ 1 đến 3 tuổi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterBtn}>
                  <Text style={styles.filterBtnText}>Cách ăn uống</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterBtn}>
                  <Text style={styles.filterBtnText}>Bé tập đi</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            <FlatList
              horizontal
              data={posts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
              style={styles.postsList}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Support Section */}
          <View style={styles.supportBox}>
            <View style={styles.supportTextBox}>
              <Text style={styles.supportText}>Hỗ trợ khám</Text>
              <Text style={styles.supportText}>sức khỏe định</Text>
              <Text style={styles.supportText}>kỳ cho bé</Text>
              <TouchableOpacity
                style={styles.supportBtn}
                onPress={() =>
                  Alert.alert(
                    "Hỗ trợ",
                    "Chức năng gọi điện đang được phát triển"
                  )
                }
                activeOpacity={0.7}
              >
                <Text style={styles.supportBtnText}>GỌI NGAY</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require("../../assets/images/support.png")}
              style={styles.supportImage}
            />
          </View>
        </View>
      </View>

      {/* Menu Drawer */}
      <MenuDrawer
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        userRole="teacher"
        userName={teacher?.teacherName}
      />
    </ScrollView>
  );
}

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

  teacherInfoBox: {
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
  teacherInfoButton: {
    width: "100%",
  },
  teacherInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  teacherAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#4DB6AC",
  },
  teacherBasicInfo: {
    flex: 1,
    marginLeft: 12,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A3442",
    marginBottom: 2,
  },
  teacherClass: {
    fontSize: 14,
    color: "#4DB6AC",
    fontWeight: "600",
  },
  teacherRole: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  teacherDetails: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
  },
  teacherDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 2,
  },
  teacherDetailLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginLeft: 8,
    minWidth: 70,
  },
  teacherDetailValue: {
    fontSize: 13,
    color: "#475569",
    flex: 1,
    marginLeft: 4,
  },
  teacherInfoFooter: {
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  teacherInfoFooterText: {
    fontSize: 12,
    color: "#64748b",
    fontStyle: "italic",
  },

  postsSection: { marginTop: 20, marginHorizontal: 16 },
  postsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  postsTitle: { fontSize: 16, fontWeight: "bold", color: "#222" },
  postsSeeAll: { color: "#06b6d4", fontSize: 13, fontWeight: "bold" },
  postsFilterRow: {
    flexDirection: "row",
    marginBottom: 8,
    flexWrap: "nowrap",
  },
  filterBtn: {
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    minWidth: 80,
  },
  filterBtnActive: { backgroundColor: "#14b8a6" },
  filterBtnText: { color: "#222", fontSize: 13 },
  filterBtnActiveText: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  postsList: { marginTop: 0 },

  postCard: {
    width: 260,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: 80,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  postTagBox: {
    backgroundColor: "#14b8a6",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
  postTagText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  postDetailText: {
    color: "#06b6d4",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: "auto",
  },

  supportBox: {
    backgroundColor: "#e0f7fa",
    borderRadius: 16,
    elevation: 2,
    marginTop: 20,
    marginHorizontal: 16,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  supportTextBox: { flex: 1, padding: 18, justifyContent: "center" },
  supportText: { fontSize: 18, color: "#222", fontWeight: "500" },
  supportBtn: {
    backgroundColor: "#14b8a6",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 14,
    alignSelf: "flex-start",
    minHeight: 44,
  },
  supportBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  supportImage: {
    width: 170,
    height: "100%",
    resizeMode: "cover",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  mockIndicator: {
    backgroundColor: "#ff9800",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
  },
  mockText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  demoNote: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
  },
  statusContainer: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: isUsingMockMode() ? "#ff9800" : "#4CAF50",
  },
  statusText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default HomeScreen;
