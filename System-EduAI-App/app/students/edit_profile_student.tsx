import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const EditProfileStudent = () => {
  const router = useRouter();
  const [name, setName] = useState("Vo Ngoc Anh");
  const [age, setAge] = useState("6");
  const [dob, setDob] = useState("16/07/2017");
  const [gender, setGender] = useState("Nam");
  const [hobby, setHobby] = useState("Vẽ, đạp xe, đọc sách");
  const [health, setHealth] = useState("Xuất sắc");

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#00bcd4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={26} color="#00bcd4" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Họ và Tên */}
        <Text style={styles.label}>Họ và Tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên của trẻ"
          value={name}
          onChangeText={setName}
        />
        {/* Tuổi */}
        <Text style={styles.label}>Tuổi</Text>
        <TextInput
          style={styles.input}
          placeholder="Tuổi"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        {/* Ngày sinh */}
        <Text style={styles.label}>Ngày sinh</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          value={dob}
          onChangeText={setDob}
        />
        {/* Giới tính */}
        <Text style={styles.label}>Giới tính</Text>
        <View style={styles.genderRow}>
          <TouchableOpacity
            style={styles.radioBtn}
            onPress={() => setGender("Nam")}
          >
            <View style={[styles.radioCircle, gender === "Nam" && styles.radioCircleActive]} />
            <Text style={styles.genderText}>Nam</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioBtn}
            onPress={() => setGender("Nữ")}
          >
            <View style={[styles.radioCircle, gender === "Nữ" && styles.radioCircleActive]} />
            <Text style={styles.genderText}>Nữ</Text>
          </TouchableOpacity>
        </View>
        {/* Sở thích */}
        <Text style={styles.label}>Sở thích</Text>
        <TextInput
          style={styles.input}
          placeholder="Danh sách sở thích"
          value={hobby}
          onChangeText={setHobby}
        />
        {/* Tình trạng sức khỏe */}
        <Text style={styles.label}>Tình trạng sức khỏe</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tình trạng sức khỏe"
          value={health}
          onChangeText={setHealth}
        />
        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
            <Text style={styles.saveBtnText}>Lưu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelBtnText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff", paddingTop: 24 },
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
  scrollContent: { padding: 20, paddingBottom: 32 },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
    color: "#222",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: "#fff",
    marginBottom: 6,
    color: "#222",
  },
  genderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  radioBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#bdbdbd",
    marginRight: 6,
    backgroundColor: "#fff",
  },
  radioCircleActive: {
    borderColor: "#00bcd4",
    backgroundColor: "#00bcd4",
  },
  genderText: {
    fontSize: 15,
    color: "#222",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 16,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#6EE05A",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 8,
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 8,
  },
  cancelBtnText: { color: "#888", fontWeight: "bold", fontSize: 16 },
});

export default EditProfileStudent;
