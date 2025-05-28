import React, { useEffect, useState, useCallback } from "react";
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
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Updated Teacher type to align with backend TeacherUserDetailDto
type Teacher = {
  teacherName: string;
  teacherPhone: string;
  teacherAddress: string;
  accountEmail: string;
  dateOfBirth: string;
  teacherGender: boolean;
  qualifications: string;
  username?: string;
};

const fetchTeacher = async (): Promise<Teacher> => {
  // Update mock data to include all fields
  return {
    teacherName: "Nguyễn Thị Hoa (Mock)",
    teacherPhone: "0901234567",
    teacherAddress: "123 Đường ABC, Quận 1, TP.HCM (Mock)",
    accountEmail: "hoa.mock@example.com",
    dateOfBirth: "1990-01-01",
    teacherGender: false, // Assuming false for female, true for male
    qualifications: "Đại học Sư Phạm (Mock)",
  };
};

const fetchClass = async () => {
  return { name: "Lớp Mầm" };
};

type ClassInfo = {
  name: string;
};

const AccountPage = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { token, logout } = useAuth();

  // Hàm lấy dữ liệu giáo viên
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let teacherData: Teacher | null = null;
      if (token) {
        console.log("Fetching teacher data with token");
        const apiData = await authApi.getTeacherDetail(token);
        if (apiData) {
          // Map API response to Teacher type
          teacherData = {
            teacherName: apiData.teacherName || "",
            teacherPhone: apiData.teacherPhone || "",
            teacherAddress: apiData.teacherAddress || "",
            accountEmail: apiData.accountEmail || "",
            dateOfBirth: apiData.dateOfBirth || "",
            teacherGender:
              apiData.teacherGender !== undefined
                ? apiData.teacherGender
                : false,
            qualifications: apiData.qualifications || "",
            username: apiData.username,
          };
        }
      }

      if (!teacherData) {
        console.log("Falling back to mock teacher data");
        teacherData = await fetchTeacher();
      }

      const classData = await fetchClass();
      setTeacher(teacherData);
      setClassInfo(classData);
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Lấy dữ liệu khi vào trang hoặc khi token thay đổi
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // Kéo để làm mới
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, [fetchData]);

  // Cập nhật thông tin giáo viên - This function might not be directly called here anymore
  // if updates are handled on update_teacher_page.
  // However, if it were, the DTO would need to match.
  const handleUpdate = async (updateDto: {
    teacherName: string;
    teacherPhone: string;
    teacherAddress: string;
    accountEmail: string;
    dateOfBirth: string;
    teacherGender: boolean;
    qualifications: string;
  }) => {
    if (!token) {
      Alert.alert("Lỗi", "Không tìm thấy token đăng nhập!");
      return;
    }

    setLoading(true);
    try {
      const updated = await authApi.updateTeacherDetail(token, updateDto);
      if (updated) {
        setTeacher(updated);
        Alert.alert("Thành công", "Cập nhật thông tin thành công!");
        // Gọi lại fetchData để đồng bộ dữ liệu mới nhất từ server
        fetchData();
      } else {
        Alert.alert("Lỗi", "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Lỗi", "Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

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
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header} />
      <View style={styles.content}>
        <View style={{ padding: 20 }}>
          <View style={styles.profileContainer}>
            <Image
              source={require("../../../System-EduAI-App/assets/images/teacher.png")}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{teacher.teacherName}</Text>
            <Text style={styles.profileClass}>Lớp: {classInfo.name}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.row}>
              <Ionicons name="person" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Họ Tên:</Text>
              <Text style={styles.value}>{teacher.teacherName || ""}</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="call" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Số Điện Thoại:</Text>
              <Text style={styles.value}>{teacher.teacherPhone || ""}</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="home" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Địa Chỉ:</Text>
              <Text style={styles.value}>{teacher.teacherAddress || ""}</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="mail" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{teacher.accountEmail || ""}</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="calendar" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Ngày Sinh:</Text>
              <Text style={styles.value}>
                {teacher.dateOfBirth
                  ? new Date(teacher.dateOfBirth).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </Text>
            </View>
            <View style={styles.row}>
              <Ionicons
                name={teacher.teacherGender ? "male" : "female"}
                size={20}
                color="#4DB6AC"
              />
              <Text style={styles.label}>Giới Tính:</Text>
              <Text style={styles.value}>
                {teacher.teacherGender ? "Nam" : "Nữ"}
              </Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="school" size={20} color="#4DB6AC" />
              <Text style={styles.label}>Bằng Cấp:</Text>
              <Text style={styles.value}>
                {teacher.qualifications || "Chưa cập nhật"}
              </Text>
            </View>
            <View style={{ marginTop: 8 }}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  router.push({
                    pathname: "/teachers/update_teacher_page",
                    params: {
                      teacherName: teacher.teacherName,
                      teacherPhone: teacher.teacherPhone,
                      teacherAddress: teacher.teacherAddress,
                      accountEmail: teacher.accountEmail,
                      dateOfBirth: teacher.dateOfBirth,
                      teacherGender: teacher.teacherGender.toString(),
                      qualifications: teacher.qualifications,
                    },
                  });
                }}
              >
                <Ionicons name="create" size={20} color="#fff" />
                <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#4DB6AC" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>

          {/* Contact Section */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Liên hệ hỗ trợ</Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => router.push("/teachers/contact_page")}
            >
              <Ionicons name="call" size={20} color="#4DB6AC" />
              <Text style={styles.contactButtonText}>Liên hệ hỗ trợ</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Posts Section */}
          <View style={styles.postsSection}>
            <Text style={styles.sectionTitle}>Bài viết gần đây</Text>
            <FlatList
              data={postData}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.postItem}
                  onPress={() => router.push("/teachers/post_page")}
                >
                  <Image source={item.image} style={styles.postImage} />
                  <View style={styles.postContent}>
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <Text style={styles.postDescription}>
                      {item.description}
                    </Text>
                    <View style={styles.postTag}>
                      <Text style={styles.postTagText}>{item.tag}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.postsList}
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
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9f9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  editButtonText: {
    color: "#4DB6AC",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff5f5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  logoutText: {
    color: "#f44336",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  contactSection: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    flex: 1,
    color: "#4DB6AC",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  postsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  postsList: {
    paddingHorizontal: 4,
  },
  postItem: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postImage: {
    width: "100%",
    height: 100,
  },
  postContent: {
    padding: 12,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  postDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  postTag: {
    backgroundColor: "#4DB6AC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  postTagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default AccountPage;
