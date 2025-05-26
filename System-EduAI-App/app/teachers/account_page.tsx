
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


const fetchTeacher = async () => {
  return {
    fullName: "Nguyễn Thị Hoa",
    phoneNumber: "0901234567",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    email: "hoa.nguyen@example.com",
  };
};

const fetchClass = async () => {
  return { name: "Lớp Mầm" };
};

type Teacher = {
  fullName: string;
  phoneNumber: string;
  address: string;
  email: string;
};

type ClassInfo = {
  name: string;
};

const AccountPage = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherData = await fetchTeacher();
        const classData = await fetchClass();
        setTeacher(teacherData);
        setClassInfo(classData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();

    const timer = setInterval(fetchData, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Đăng Xuất",
      "Bạn có muốn đăng xuất không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          onPress: () => {
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

  if (!teacher || !classInfo) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>Không có dữ liệu</Text>
      </View>
    );
  }

  const postData = [
    {
      id: "1",
      title: "Mon\ntess",
      description: "Cho bé từ nhỏ đến lớn",
      tag: "Phương pháp Montess",
      image: require("../../../System-EduAI-App/assets/images/montess.png"),
    },
    {
      id: "2",
      title: "Ăn\nuống",
      description: "Cho bé từ 1 đến 3 tuổi",
      tag: "Cách ăn uống",
      image: require("../../../System-EduAI-App/assets/images/support1.png"),
    },
    {
      id: "3",
      title: "Mon\ntess",
      description: "Cho bé từ nhỏ đến lớn",
      tag: "Phương pháp Montess",
      image: require("../../../System-EduAI-App/assets/images/montess.png"),
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <View style={styles.header} />
      <View style={styles.content}>
        <View style={{ padding: 20 }}>
          <View style={styles.profileContainer}>
            <Image
              source={require("../../../System-EduAI-App/assets/images/teacher.png")}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{teacher.fullName}</Text>
            <Text style={styles.profileClass}>Lớp: {classInfo.name}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.row}>
              <Ionicons name="person" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Họ Tên:</Text>
              <Text style={styles.value}>{teacher.fullName}</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="call" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Số Điện Thoại:</Text>
              <Text style={styles.value}>{teacher.phoneNumber}</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="home" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Địa Chỉ:</Text>
              <Text style={styles.value}>{teacher.address}</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="mail" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{teacher.email}</Text>
            </View>
            <View style={{ marginTop: 8 }}>
              <TouchableOpacity onPress={() => router.push("/teachers/update_teacher_page")}>
                <Text style={styles.updateLink}>Cập Nhật</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.logoutRow}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="#4DB6AC" />
            <Text style={styles.logoutText}>Đăng Xuất</Text>
          </TouchableOpacity>

          <View style={styles.postsSection}>
            <View style={styles.postsHeader}>
              <Text style={styles.postsTitle}>Bài viết</Text>
              <TouchableOpacity onPress={() => router.push("/teachers/account_page")}>
                <Text style={styles.seeAll}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tabList}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={[
                  { id: "1", label: "Montess", active: true },
                  { id: "2", label: "Từ 1 đến 3 tuổi", active: false },
                  { id: "3", label: "Cách ăn uống", active: false },
                  { id: "4", label: "Bé tập đi", active: false },
                ]}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={item.active ? styles.tabButtonActive : styles.tabButton}
                  >
                    <Text style={item.active ? styles.tabButtonTextActive : styles.tabButtonText}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={postData}
              renderItem={({ item }) => (
                <View style={styles.postCard}>
                  <Image source={item.image} style={styles.postImage} />
                  <View style={styles.postContent}>
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <View style={styles.postTag}>
                      <Text style={styles.postTagText}>{item.tag}</Text>
                    </View>
                    <TouchableOpacity>
                      <Text style={styles.postDetail}>Xem chi tiết</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ marginTop: 8 }}
            />
          </View>
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
    color: "#14b8a6",
  },
  header: {
    height: 80,
    backgroundColor: "#4DB6AC",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  content: {
    marginTop: -40,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: 600,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0f2f1",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  profileClass: {
    fontSize: 16,
    color: "#555",
  },
  infoCard: {
    backgroundColor: "#e0f7fa",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    marginLeft: 8,
    marginRight: 4,
    color: "#333",
    minWidth: 90, 
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
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    alignSelf: "flex-end",
  },
  logoutText: {
    color: "#4DB6AC",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 16,
  },
  postsSection: {
    marginTop: 24,
  },
  postsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAll: {
    color: "#00796B",
    fontWeight: "bold",
    fontSize: 15,
  },
  tabList: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tabButton: {
    backgroundColor: "#e0f2f1",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  tabButtonActive: {
    backgroundColor: "#4DB6AC",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  tabButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  tabButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 12,
    width: 180,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  postImage: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  postContent: {
    padding: 10,
  },
  postTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  postTag: {
    backgroundColor: "#e0f2f1",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  postTagText: {
    color: "#00796B",
    fontSize: 13,
  },
  postDetail: {
    color: "#4DB6AC",
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 4,
  },
});

export default AccountPage;