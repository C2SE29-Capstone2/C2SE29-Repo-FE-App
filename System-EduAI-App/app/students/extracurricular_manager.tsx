import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const days = [
  { label: "Thứ 2", date: 15 },
  { label: "Thứ 3", date: 16 },
  { label: "Thứ 4", date: 17 },
  { label: "Thứ 5", date: 18 },
  { label: "Thứ 6", date: 19 },
  { label: "Thứ 7", date: 20 },
  { label: "Chủ nhật", date: 21 },
];

const ExtracurricularManager = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#00bcd4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý hoạt động</Text>
        <TouchableOpacity style={styles.headerNotif}>
          <Ionicons name="notifications" size={24} color="#00bcd4" />
          <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={require("../../assets/images/student_2_nam.png")}
            style={styles.profileAvatar}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.profileName}>Phillip Lê</Text>
            <Text style={styles.profileAge}>Tuổi: 24</Text>
          </View>
        </View>

        {/* Date Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: 16, marginBottom: 10 }}
          contentContainerStyle={{ flexDirection: "row" }}
        >
          {days.map((d, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.dateItem,
                selectedDay === idx && styles.dateItemActive,
              ]}
              onPress={() => setSelectedDay(idx)}
            >
              <Text style={selectedDay === idx ? styles.dateLabelActive : styles.dateLabel}>{d.label}</Text>
              <Text style={selectedDay === idx ? styles.dateNumActive : styles.dateNum}>{d.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Daily Activity Bar Chart */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Hoạt động hằng ngày</Text>
          <View style={styles.barChartRow}>
            <View style={styles.barCol}>
              <View style={[styles.bar, { height: 80, backgroundColor: '#2196f3' }]} />
              <Text style={styles.barLabel}>2 giờ</Text>
              <Text style={styles.barDesc}>Học tập</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.bar, { height: 60, backgroundColor: '#9c27b0' }]} />
              <Text style={styles.barLabel}>1.5 giờ</Text>
              <Text style={styles.barDesc}>Trò chơi</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.bar, { height: 40, backgroundColor: '#ff9800' }]} />
              <Text style={styles.barLabel}>1 giờ</Text>
              <Text style={styles.barDesc}>Nghỉ ngơi</Text>
            </View>
          </View>
        </View>

        {/* Activity Time Progress */}
        <View style={styles.progressBox}>
          <View style={styles.progressRow}>
            <Ionicons name="book" size={20} color="#2196f3" style={{ marginRight: 8 }} />
            <Text style={styles.progressLabel}>Thời gian học</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.progressValue}>2 giờ</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBar, { width: '80%', backgroundColor: '#2196f3' }]} />
          </View>
        </View>
        <View style={styles.progressBox}>
          <View style={styles.progressRow}>
            <Ionicons name="game-controller" size={20} color="#9c27b0" style={{ marginRight: 8 }} />
            <Text style={styles.progressLabel}>Thời gian chơi</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.progressValue}>1.5 giờ</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBar, { width: '60%', backgroundColor: '#9c27b0' }]} />
          </View>
        </View>

        {/* Play Time Details */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Thời gian chơi</Text>
            <Text style={styles.sectionLink}>Xem chi tiết</Text>
          </View>
          <View style={styles.iconRow}>
            <View style={styles.iconCard}>
              <FontAwesome5 name="futbol" size={28} color="#00bcd4" />
              <Text style={styles.iconLabel}>Chơi bóng</Text>
            </View>
            <View style={styles.iconCard}>
              <FontAwesome5 name="puzzle-piece" size={28} color="#00bcd4" />
              <Text style={styles.iconLabel}>Ghép hình</Text>
            </View>
            <View style={styles.iconCard}>
              <MaterialIcons name="sports-soccer" size={28} color="#00bcd4" />
              <Text style={styles.iconLabel}>Vui đùa</Text>
            </View>
          </View>
        </View>

        {/* Study Time Details */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Thời gian học tập</Text>
            <Text style={styles.sectionLink}>Thu hồi</Text>
          </View>
          <View style={styles.iconRow}>
            <View style={styles.iconCard}>
              <Ionicons name="book" size={28} color="#00bcd4" />
              <Text style={styles.iconLabel}>Đọc</Text>
            </View>
            <View style={styles.iconCard}>
              <MaterialIcons name="edit" size={28} color="#00bcd4" />
              <Text style={styles.iconLabel}>Viết</Text>
            </View>
            <View style={styles.iconCard}>
              <Ionicons name="bulb" size={28} color="#00bcd4" />
              <Text style={styles.iconLabel}>Sáng tạo</Text>
            </View>
          </View>
          <View style={styles.studyDetailRow}>
            <Ionicons name="book" size={20} color="#00bcd4" style={{ marginRight: 8 }} />
            <Text style={styles.studyDetailLabel}>Đọc</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.studyDetailValue}>45 phút</Text>
          </View>
          <View style={styles.studyDetailRow}>
            <MaterialIcons name="edit" size={20} color="#00bcd4" style={{ marginRight: 8 }} />
            <Text style={styles.studyDetailLabel}>Viết</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.studyDetailValue}>20 phút</Text>
          </View>
          <View style={styles.studyDetailRow}>
            <Ionicons name="bulb" size={20} color="#00bcd4" style={{ marginRight: 8 }} />
            <Text style={styles.studyDetailLabel}>Sáng tạo</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.studyDetailValue}>30 phút</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5fafd" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#00bcd4" },
  headerNotif: { position: "relative" },
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
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
    marginBottom: 10,
    elevation: 1,
    marginHorizontal: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eee",
  },
  profileName: { fontWeight: "bold", fontSize: 16, color: "#222" },
  profileAge: { color: "#888", fontSize: 13 },
  dateRow: {
  },
  dateItem: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#e0f7fa",
    borderRadius: 12,
    marginHorizontal: 4,
    minWidth: 70,
  },
  dateItemActive: {
    backgroundColor: "#00bcd4",
  },
  dateLabel: { color: "#00bcd4", fontWeight: "bold", fontSize: 13 },
  dateLabelActive: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  dateNum: { color: "#00bcd4", fontWeight: "bold", fontSize: 16 },
  dateNumActive: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  sectionBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
    elevation: 1,
  },
  sectionTitle: { fontWeight: "bold", fontSize: 15, color: "#00bcd4", marginBottom: 8 },
  barChartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
    marginBottom: 8,
  },
  barCol: { alignItems: "center", flex: 1 },
  bar: {
    width: 28,
    borderRadius: 8,
    marginBottom: 6,
  },
  barLabel: { fontWeight: "bold", color: "#222", fontSize: 13 },
  barDesc: { color: "#00bcd4", fontSize: 13 },
  progressBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
    elevation: 1,
  },
  progressRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  progressLabel: { color: "#222", fontWeight: "bold", fontSize: 14 },
  progressValue: { color: "#00bcd4", fontWeight: "bold", fontSize: 14 },
  progressBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0f7fa",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: 8,
    borderRadius: 6,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionLink: { color: "#00bcd4", fontSize: 13, fontWeight: "bold" },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 8,
  },
  iconCard: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#e0f7fa",
    borderRadius: 12,
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  iconLabel: { color: "#00bcd4", fontWeight: "bold", fontSize: 13, marginTop: 6 },
  studyDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 2,
  },
  studyDetailLabel: { color: "#222", fontSize: 14 },
  studyDetailValue: { color: "#00bcd4", fontWeight: "bold", fontSize: 14 },
});

export default ExtracurricularManager;
