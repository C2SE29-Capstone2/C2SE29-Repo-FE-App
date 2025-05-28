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
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Import từ file cùng thư mục
import { publicApi } from "../services/api";
import { useTeacher } from "../hooks/useTeacher";
import { useClass } from "../hooks/useClass";
import { useNotifications } from "../hooks/useNotifications";
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
  const { teacher, isLoading: teacherLoading } = useTeacher();
  const { classInf, isLoading: classLoading } = useClass();
  const { notifications, isLoading: notificationsLoading } = useNotifications();

  const [networkError, setNetworkError] = useState<string | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

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
      onPress={() =>
        handleNavigationWithConnection("/teachers/post_page", true)
      }
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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {networkError && (
        <View
          style={{
            backgroundColor: "#ffeb3b",
            padding: 10,
            margin: 16,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#333", textAlign: "center" }}>
            {networkError}
          </Text>
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Icon tìm kiếm */}
            <TouchableOpacity
              onPress={() =>
                handleNavigationWithConnection("/teachers/album", false)
              }
              style={{ marginRight: 16 }}
            >
              <MaterialIcons name="search" size={28} color="white" />
            </TouchableOpacity>

            {/* Icon thông báo */}
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
        </View>

        <View style={styles.eventBox}>
          <View style={styles.eventRow}>
            <View>
              <Text style={styles.eventTitle}>Sự Kiện Sắp Tới</Text>
              <Text style={styles.eventSubtitle}>Trại Hè Rám Nắng</Text>
              <View style={styles.eventInfoRow}>
                <Text style={styles.eventInfoLabel}>Thời gian dự kiến: </Text>
                <Text style={styles.eventInfoValue}>30/8/2025</Text>
              </View>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={25} color="white" />
          </View>
        </View>
      </ImageBackground>

      {/* Body */}
      <View style={styles.body}>
        {/* Navigation Buttons */}
        <View style={styles.navBox}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              // Navigate to message with teacher parameters
              router.push({
                pathname: "/parents/message_parent",
                params: {
                  teacherId: 1, // Get from actual teacher data
                  classroomId: 1, // Get from actual classroom data
                  teacherName: teacher?.fullName || "Giáo viên",
                },
              });
            }}
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

        {/* Teacher Info - Fix TouchableOpacity */}
        <View style={styles.teacherInfoBox}>
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
            <Image
              source={require("../../assets/images/teacher.png")}
              style={styles.teacherAvatar}
              defaultSource={require("../../assets/images/teacher.png")}
            />
            <View style={styles.teacherInfoTextBox}>
              <View style={styles.teacherInfoRow}>
                <Text style={styles.teacherLabel}>Học sinh: </Text>
                <Text style={styles.teacherValue}>Xem thông tin</Text>
              </View>
              <View style={styles.teacherInfoRow}>
                <Text style={styles.teacherLabel}>Lớp: </Text>
                <Text style={styles.teacherValue}>
                  {classInf?.name || "Mầm"}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Posts Section - Fix TouchableOpacity */}
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

        {/* Support Section - Fix TouchableOpacity */}
        <View style={styles.supportBox}>
          <View style={styles.supportTextBox}>
            <Text style={styles.supportText}>Hỗ trợ khám</Text>
            <Text style={styles.supportText}>sức khỏe định</Text>
            <Text style={styles.supportText}>kỳ cho bé</Text>
            <TouchableOpacity
              style={styles.supportBtn}
              onPress={() =>
                Alert.alert("Hỗ trợ", "Chức năng gọi điện đang được phát triển")
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

      {/* Menu Drawer */}
      <MenuDrawer
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        userRole="parent"
        userName="Phụ huynh"
      />
    </ScrollView>
  );
}

// Sửa App component chỉ render HomeScreen trực tiếp
export default function App() {
  return <HomeScreen />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6fafd" },
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
    paddingVertical: 10, // Thêm padding để tăng vùng touch
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
    // Đảm bảo icon box có kích thước đủ lớn để touch
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
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  teacherAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  teacherInfoTextBox: { marginLeft: 14 },
  teacherInfoRow: { flexDirection: "row", marginTop: 4 },
  teacherLabel: { fontSize: 15, fontWeight: "500", color: "#333" },
  teacherValue: { fontSize: 15, fontWeight: "bold", color: "#1A3442" },

  studentInfoButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8, // Thêm padding để tăng vùng touch
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
    flexWrap: "nowrap", // Không xuống dòng
    overflow: "scroll", // Cho phép scroll ngang
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
    paddingVertical: 12, // Tăng padding
    marginTop: 14,
    alignSelf: "flex-start",
    minHeight: 44, // Đảm bảo chiều cao tối thiểu cho touch
  },
  supportBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  supportImage: {
    width: 170,
    height: "100%",
    resizeMode: "cover",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  sidebar: {
    width: 250,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  drawerContent: {
    padding: 30,
    paddingTop: 100,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  sidebarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 10,
  },
  hr: {
    borderBottomColor: "white",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});
