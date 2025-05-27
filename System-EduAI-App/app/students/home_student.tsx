import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const StudentHomeScreen = () => {
  // State để quản lý mở/đóng menu
  const [showMenu, setShowMenu] = React.useState(false);
  const router = useRouter();

  // Danh sách menu mẫu
  const menuItems = [
    {
      label: "Thông tin cá nhân",
      icon: <Ionicons name="person" size={22} color="#00bcd4" />,
      onPress: () => {
        setShowMenu(false);
        setTimeout(() => router.push("/students/profile_student" as any), 0);
      },
    },
    {
      label: "Theo dõi tăng trưởng",
      icon: <Ionicons name="bar-chart" size={22} color="#00bcd4" />, // đổi icon
      onPress: () => {
        setShowMenu(false);
        setTimeout(() => router.push("/students/growth_tracking" as any), 0);
      },
    },
    {
      label: "Thống kê học tập",
      icon: <Ionicons name="stats-chart" size={22} color="#00bcd4" />,
      onPress: () => {},
    },
    {
      label: "Lịch trình hằng ngày",
      icon: <Ionicons name="calendar" size={22} color="#00bcd4" />,
      onPress: () => {
        setShowMenu(false);
        setTimeout(() => router.push("/students/daily_schedule" as any), 0);
      },
    },
    {
      label: "Hoạt động ngoại khóa",
      icon: <Ionicons name="bicycle" size={22} color="#00bcd4" />, // đổi icon cho đúng
      onPress: () => {},
    },
    {
      label: "Gợi ý thực đơn",
      icon: <Ionicons name="fast-food" size={22} color="#00bcd4" />,
      onPress: () => {},
    },
    { label: "Thông báo", icon: <Ionicons name="notifications" size={22} color="#00bcd4" />, onPress: () => {} },
    { label: "Đăng xuất", icon: <Ionicons name="log-out" size={22} color="#00bcd4" />, onPress: () => {} },
  ];

  return (
    <View style={styles.root}>
      {/* Menu Drawer Overlay */}
      {showMenu && (
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuDrawer}>
            <Text style={styles.menuHeader}>Menu</Text>
            {menuItems.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.menuItem} onPress={item.onPress}>
                {item.icon}
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      )}

      {/* Header with icons */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => setShowMenu(true)}>
          <Ionicons name="menu" size={28} color="#00bcd4" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="search"
            size={24}
            color="#00bcd4"
            style={{ marginRight: 16 }}
          />
          <View>
            <Ionicons name="notifications" size={24} color="#00bcd4" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Banner Sự kiện sắp tới */}
        <View style={styles.bannerContainer}>
          <Image
            source={require("../../assets/images/background.png")}
            style={styles.banner}
          />
          <View style={styles.bannerOverlay}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Sự kiện sắp tới</Text>
              <Text style={styles.bannerEvent}>
                TRẠI HÈ RẠM NẮNG tại Hòa An Farm
              </Text>
              <Text style={styles.bannerDetail}>
                Thời gian dự kiến 30/4/2024
              </Text>
              <Text style={styles.bannerDetail}>
                Địa điểm: Hòa An Farm, Sơn Trà, Đà Nẵng
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#fff" style={styles.bannerArrow} />
          </View>
        </View>

        {/* Main Menus dưới banner */}
        <View style={styles.mainMenuBar}>
          <TouchableOpacity
            style={styles.mainMenuItem}
            onPress={() => router.push("/students/daily_schedule" as any)}
          >
            <Ionicons name="calendar" size={28} color="#00bcd4" />
            <Text style={styles.mainMenuLabel}>Lịch trình</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mainMenuItem}
            onPress={() => { /* Thống kê học tập */ }}
          >
            <Ionicons name="stats-chart" size={28} color="#00bcd4" />
            <Text style={styles.mainMenuLabel}>Thống kê</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mainMenuItem}
            onPress={() => { /* Gợi ý thực đơn */ }}
          >
            <Ionicons name="fast-food" size={28} color="#00bcd4" />
            <Text style={styles.mainMenuLabel}>Thực đơn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mainMenuItem}
            onPress={() => { /* Hoạt động ngoại khóa */ }}
          >
            <Ionicons name="bicycle" size={28} color="#00bcd4" />
            <Text style={styles.mainMenuLabel}>Ngoại khóa</Text>
          </TouchableOpacity>
        </View>

        {/* Class Card */}
        <View style={styles.classCard}>
          <TouchableOpacity onPress={() => router.push("/students/profile_student" as any)}>
            <Image
              source={require("../../assets/images/student_2_nam.png")}
              style={styles.classImage}
            />
          </TouchableOpacity>
          <View style={{ marginLeft: 12 }}>
            <TouchableOpacity onPress={() => router.push("/students/profile_student" as any)}>
              <Text style={styles.classLabel}>
                Lớp: <Text style={styles.classValue}>Chồi Non</Text>
              </Text>
              <Text style={styles.classLabel}>
                Sĩ số: <Text style={styles.classValue}>15</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Posts Section */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Bài viết</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 10 }}
        >
          <View style={styles.tag}>
            <Text style={styles.tagText}>Montess</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Từ 1 đến 3 tuổi</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Cách ăn uống</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Bé tập đi</Text>
          </View>
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.postCard}>
            <Image
              source={require("../../assets/images/smile.png")}
              style={styles.postImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.postTitle}>Montess</Text>
              <Text style={styles.postDesc}>Cho bé từ nhỏ đến lớn</Text>
              <TouchableOpacity>
                <Text style={styles.postDetail}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postCard}>
            <Image
              source={require("../../assets/images/choinon.png")}
              style={styles.postImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.postTitle}>Ăn uống</Text>
              <Text style={styles.postDesc}>Cách ăn uống cho bé</Text>
              <TouchableOpacity>
                <Text style={styles.postDetail}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Health Support Card */}
        <View style={styles.healthCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.healthTitle}>
              Hỗ trợ khám sức khỏe định kì cho bé
            </Text>
            <TouchableOpacity style={styles.healthBtn}>
              <Text style={styles.healthBtnText}>GỌI NGAY</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require("../../assets/images/support.png")}
            style={styles.healthImage}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5fafd" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: "#f44336",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  container: { flex: 1, paddingHorizontal: 16 },
  bannerContainer: {
    marginTop: 10,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 1,
    position: "relative",
    height: 120,
    marginBottom: 10,
  },
  banner: { width: "100%", height: 120, position: "absolute", top: 0, left: 0 },
  bannerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: "100%",
  },
  bannerContent: {
    flex: 1,
    justifyContent: "center",
  },
  bannerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 2,
    textShadowColor: "#000",
    textShadowRadius: 2,
  },
  bannerEvent: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
    textShadowColor: "#000",
    textShadowRadius: 2,
  },
  bannerDetail: {
    color: "#fff",
    fontSize: 12,
    textShadowColor: "#000",
    textShadowRadius: 2,
  },
  bannerArrow: {
    marginLeft: 8,
    alignSelf: "center",
  },
  mainMenuBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: -28,
    marginBottom: 12,
    marginHorizontal: 0,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12, // thêm padding ngang để cân giữa
  },
  mainMenuItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    // bỏ paddingHorizontal để các item chia đều
  },
  mainMenuLabel: {
    marginTop: 10,
    fontSize: 13,
    color: "#00bcd4",
    fontWeight: "bold",
    textAlign: "center",
  },
  classCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
    marginBottom: 10,
    elevation: 1,
  },
  classImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eee",
  },
  classLabel: { fontSize: 15, color: "#888", marginBottom: 2 },
  classValue: { color: "#00bcd4", fontWeight: "bold" },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: "bold", color: "#222" },
  seeAll: { color: "#00bcd4", fontSize: 14, fontWeight: "500" },
  tag: {
    backgroundColor: "#e0f7fa",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    marginTop: 8,
  },
  tagText: { color: "#00bcd4", fontWeight: "bold", fontSize: 13 },
  postCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    width: 220,
    elevation: 1,
    alignItems: "center",
  },
  postImage: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
  postTitle: { fontWeight: "bold", fontSize: 15, color: "#00bcd4" },
  postDesc: { fontSize: 13, color: "#444", marginBottom: 4 },
  postDetail: { color: "#00bcd4", fontSize: 13, fontWeight: "bold" },
  healthCard: {
    flexDirection: "row",
    backgroundColor: "#e0f7fa",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 18,
    marginBottom: 80,
  },
  healthTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0097a7",
    marginBottom: 8,
  },
  healthBtn: {
    backgroundColor: "#00bcd4",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  healthBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  healthImage: { width: 70, height: 70, borderRadius: 12, marginLeft: 10 },
  menuOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 100,
    flexDirection: "row",
  },
  menuDrawer: {
    width: 240,
    backgroundColor: "#fff",
    height: "100%",
    paddingTop: 60,
    paddingHorizontal: 18,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
  },
  menuHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00bcd4",
    marginBottom: 18,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e0f7fa",
  },
  menuItemText: {
    marginLeft: 14,
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
});

export default StudentHomeScreen;
