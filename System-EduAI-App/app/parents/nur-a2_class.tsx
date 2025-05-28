import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const students = [
  {
    name: "Nguyễn Thị A",
    avatar: require("../../assets/images/student_1.png"),
    status: "present",
    time: "08:15",
    class: "Nur-A1",
  },
  {
    name: "Nguyễn Văn B",
    avatar: require("../../assets/images/student_2_nam.png"),
    status: "present",
    time: "08:15",
    class: "Nur-A1",
  },
  {
    name: "Lê Trần D",
    avatar: require("../../assets/images/student_2.png"),
    status: "absent",
    time: null,
    class: "Nur-A1",
  },
  {
    name: "Nguyễn Ngọc C",
    avatar: require("../../assets/images/student_1.png"),
    status: "present",
    time: "08:15",
    class: "Nur-A1",
  },
  {
    name: "Võ Văn E",
    avatar: require("../../assets/images/student_2_nam.png"),
    status: "absent",
    time: null,
    class: "Nur-A1",
  },
];

export default function NurA1Class() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={28} color="#1A3442" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lớp Nur-A1</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={{ marginRight: 8 }}>
            <MaterialIcons
              name="notifications-active"
              size={28}
              color="#06b6d4"
            />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }}>
        {/* Card tổng quan lớp */}
        <View style={styles.classSummaryCard}>
          <Text style={styles.classSummaryTitle}>Lớp Nur-A1</Text>
          <Text style={styles.classSummarySub}>Lớp của Thầy Lê Trần Ninh</Text>
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <View style={styles.presentBox}>
              <MaterialIcons name="groups" size={20} color="#14b8a6" />
              <Text style={styles.presentText}>Hiện tại</Text>
              <Text style={styles.presentCount}>18 Học Sinh</Text>
            </View>
            <View style={styles.absentBox}>
              <MaterialIcons name="groups" size={20} color="#ef4444" />
              <Text style={styles.absentText}>Vắng</Text>
              <Text style={styles.absentCount}>2 Học Sinh</Text>
            </View>
          </View>
        </View>
        {/* Danh sách học sinh */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>Các học sinh</Text>
          <View style={{ flexDirection: "row", marginLeft: 8 }}>
            <Text style={styles.presentLabel}>Hiện tại</Text>
            <Text style={styles.absentLabel}>Vắng</Text>
          </View>
        </View>
        {students.map((s, idx) => (
          <View
            key={idx}
            style={[
              styles.studentCard,
              s.status === "present"
                ? styles.studentPresent
                : styles.studentAbsent,
            ]}
          >
            <Image source={s.avatar} style={styles.studentAvatar} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.studentName}>{s.name}</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <MaterialIcons
                  name={s.status === "present" ? "check-circle" : "error"}
                  size={16}
                  color={s.status === "present" ? "#14b8a6" : "#ef4444"}
                />
                <Text
                  style={
                    s.status === "present"
                      ? styles.timePresent
                      : styles.timeAbsent
                  }
                >
                  {s.status === "present" ? `Đến lúc ${s.time}` : "Chưa đến"}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={
                  s.status === "present"
                    ? styles.statusPresent
                    : styles.statusAbsent
                }
              >
                {s.status === "present" ? "Hiện tại" : "Vắng"}
              </Text>
              <Text style={styles.studentClass}>{s.class}</Text>
            </View>
          </View>
        ))}
        {/* Thống kê nhanh */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.quickStatHeader}>Thống kê nhanh</Text>
        </View>
        <View style={styles.quickStatRow}>
          <View style={styles.quickStatBox}>
            <MaterialIcons name="login" size={20} color="#14b8a6" />
            <Text style={styles.quickStatLabel}>Thời gian vào lớp</Text>
            <Text style={styles.quickStatValue}>08:10</Text>
          </View>
          <View style={styles.quickStatBox}>
            <MaterialIcons name="login" size={20} color="#ef4444" />
            <Text style={styles.quickStatLabel}>Thời gian vào lớp</Text>
            <Text style={styles.quickStatValue}>08:10</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6fafd" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#06b6d4",
  },
  notificationBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  notificationText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  classSummaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 18,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: "#e0f7fa",
  },
  classSummaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A3442",
  },
  classSummarySub: {
    fontSize: 14,
    color: "#14b8a6",
    marginTop: 2,
  },
  presentBox: {
    backgroundColor: "#e0f7fa",
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    flex: 1,
    alignItems: "center",
  },
  presentText: {
    color: "#14b8a6",
    fontWeight: "bold",
    fontSize: 13,
    marginTop: 2,
  },
  presentCount: {
    color: "#14b8a6",
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 2,
  },
  absentBox: {
    backgroundColor: "#fbeaec",
    borderRadius: 12,
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  absentText: {
    color: "#ef4444",
    fontWeight: "bold",
    fontSize: 13,
    marginTop: 2,
  },
  absentCount: {
    color: "#ef4444",
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    marginBottom: 4,
    marginTop: 8,
  },
  sectionHeader: {
    backgroundColor: "#14b8a6",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: "hidden",
  },
  presentLabel: {
    backgroundColor: "#e0f7fa",
    color: "#14b8a6",
    fontWeight: "bold",
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  absentLabel: {
    backgroundColor: "#fbeaec",
    color: "#ef4444",
    fontWeight: "bold",
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  studentCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    borderWidth: 1.5,
  },
  studentPresent: {
    borderColor: "#14b8a6",
  },
  studentAbsent: {
    borderColor: "#ef4444",
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#fff",
  },
  studentName: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#1A3442",
  },
  timePresent: {
    color: "#14b8a6",
    fontSize: 13,
    marginLeft: 4,
  },
  timeAbsent: {
    color: "#ef4444",
    fontSize: 13,
    marginLeft: 4,
  },
  statusPresent: {
    backgroundColor: "#e0f7fa",
    color: "#14b8a6",
    fontWeight: "bold",
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  statusAbsent: {
    backgroundColor: "#fbeaec",
    color: "#ef4444",
    fontWeight: "bold",
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  studentClass: {
    fontSize: 12,
    color: "#1A3442",
    marginTop: 2,
  },
  quickStatHeader: {
    backgroundColor: "#14b8a6",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: "hidden",
  },
  quickStatRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  quickStatBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    flex: 1,
    alignItems: "center",
    padding: 12,
    marginRight: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    borderWidth: 1.5,
    borderColor: "#e0f7fa",
  },
  quickStatLabel: {
    color: "#1A3442",
    fontSize: 13,
    marginTop: 4,
  },
  quickStatValue: {
    color: "#14b8a6",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 2,
  },
});
