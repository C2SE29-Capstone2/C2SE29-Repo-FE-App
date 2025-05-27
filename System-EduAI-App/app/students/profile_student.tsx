import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ProfileStudent = () => {
  const router = useRouter();

  // Handler cho nút sửa thông tin cá nhân, sở thích, sức khỏe
  const handleEditInfo = () => {
    // TODO: Thực hiện chức năng sửa thông tin cá nhân, sở thích, tình trạng sức khỏe
  };

  // Handler cho nút cập nhật đo lường
  const handleUpdateMeasurement = () => {
    // TODO: Thực hiện chức năng cập nhật chiều cao, cân nặng
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#00bcd4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={26} color="#00bcd4" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={require("../../assets/images/student_2_nam.png")}
            style={styles.avatar}
          />
        </View>
        {/* Name & Age */}
        <Text style={styles.name}>Vo Ngoc Anh</Text>
        <Text style={styles.age}>Tuổi: 6</Text>

        {/* Sửa thông tin cá nhân, sở thích, sức khỏe */}
        <View style={styles.btnRow}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push("/students/edit_profile_student" as any)}
          >
            <Text style={styles.editBtnText}>Sửa</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
          <Text style={styles.cardText}>Ngày sinh: 16/07/2017</Text>
          <Text style={styles.cardText}>Giới tính: Nam</Text>
        </View>

        {/* Hobby */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sở thích</Text>
          <Text style={styles.cardText}>Vẽ, đạp xe, đọc sách</Text>
        </View>

        {/* Health */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tình trạng sức khỏe</Text>
          <Text style={styles.cardText}>Xuất sắc</Text>
        </View>

        {/* Cập nhật đo lường */}
        <View style={styles.btnRow}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={styles.updateBtn}
            onPress={() => router.push("/students/update_measurement_student" as any)}
          >
            <Text style={styles.updateBtnText}>Cập Nhật</Text>
          </TouchableOpacity>
        </View>
        {/* Measurement */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Đo lường</Text>
          <Text style={styles.cardText}>Chiều cao: 110 cm</Text>
          <Text style={styles.cardText}>Cân nặng: 30kg</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff", paddingTop: 38 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    height: 56,
  },
  headerTitle: {
    fontSize: 18,
    color: "#00bcd4",
    fontWeight: "500",
    textAlign: "center",
    flex: 1,
    marginLeft: -24,
  },
  badge: {
    position: "absolute",
    top: -4,
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
  scrollContent: { alignItems: "center", paddingBottom: 32 },
  avatarContainer: { alignItems: "center", marginVertical: 16 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
  },
  name: { textAlign: "center", fontSize: 22, fontWeight: "600", marginTop: 8 },
  age: { textAlign: "center", fontSize: 16, color: "#888", marginBottom: 12 },
  btnRow: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    marginBottom: 2,
    marginTop: 4,
  },
  editBtn: {
    backgroundColor: "#6EE05A",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 7,
    alignSelf: "flex-end",
  },
  editBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  card: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: "90%",
    alignSelf: "center",
    elevation: 1,
  },
  cardTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  cardText: { fontSize: 15, color: "#333", marginBottom: 2 },
  updateBtn: {
    backgroundColor: "#6EE05A",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 7,
    alignSelf: "flex-end",
  },
  updateBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default ProfileStudent;
