import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const nextMeals = [
  {
    name: "Quinoa Power Bowl",
    type: "Bữa trưa",
    kcal: 520,
    protein: 35,
    image: require("../../assets/images/lunch_1.png"),
  },
  {
    name: "Hỗn hợp rau củ",
    type: "Bữa trưa",
    kcal: 120,
    protein: 35,
    image: require("../../assets/images/lunch_2.png"),
  },
];

const todayMeals = [
  {
    icon: "sunny",
    label: "Bữa sáng",
    time: "8:00",
    note: "trong 30 phút nữa",
    done: true,
  },
  {
    icon: "restaurant",
    label: "Bữa trưa",
    time: "12:30",
    note: "trong 4 giờ nữa",
    done: false,
  },
  {
    icon: "cafe",
    label: "Bữa chiều",
    time: "15:30",
    note: "trong 7 giờ nữa",
    done: false,
  },
  {
    icon: "moon",
    label: "Bữa tối",
    time: "16:30",
    note: "trong 8 giờ nữa",
    done: false,
  },
];

const DietTracking = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#00bcd4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theo dõi chế độ ăn uống</Text>
        <TouchableOpacity style={styles.headerNotif}>
          <Ionicons name="notifications" size={24} color="#00bcd4" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
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
            <Text style={styles.profileAge}>Tuổi: 4</Text>
          </View>
        </View>
        {/* Kế hoạch hôm nay */}
        <View style={styles.planBox}>
          <Text style={styles.planTitle}>Kế hoạch hôm nay</Text>
          <Text style={styles.planDate}>Thứ năm, ngày 14 tháng 3</Text>
          <View style={styles.planGoalRow}>
            <Ionicons name="flame" size={22} color="#fff" style={styles.planGoalIcon} />
            <View>
              <Text style={styles.planGoalLabel}>Mục tiêu calo</Text>
              <Text style={styles.planGoalValue}>2,100 Kcal</Text>
            </View>
          </View>
        </View>
        {/* Tiến trình hàng tuần */}
        <View style={styles.progressBox}>
          <Text style={styles.progressTitle}>Tiến trình hàng tuần</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressCircleBox}>
              <View style={[styles.progressCircle, { borderColor: "#2196f3" }]}>
                <Text style={styles.progressPercent}>75%</Text>
              </View>
              <Text style={styles.progressLabel}>Calo</Text>
            </View>
            <View style={styles.progressCircleBox}>
              <View style={[styles.progressCircle, { borderColor: "#26c6da" }]}>
                <Text style={styles.progressPercent}>80%</Text>
              </View>
              <Text style={styles.progressLabel}>Protein</Text>
            </View>
            <View style={styles.progressCircleBox}>
              <View style={[styles.progressCircle, { borderColor: "#ff9800" }]}>
                <Text style={styles.progressPercent}>60%</Text>
              </View>
              <Text style={styles.progressLabel}>Nước</Text>
            </View>
          </View>
        </View>
        {/* Bữa ăn tiếp theo */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionFlag} />
            <Text style={styles.sectionTitle}>Bữa ăn tiếp theo</Text>
          </View>
          {nextMeals.map((item, idx) => (
            <View key={idx} style={styles.nextMealCard}>
              <Image source={item.image} style={styles.nextMealImage} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.nextMealName}>{item.name}</Text>
                <Text style={styles.nextMealType}>{item.type}</Text>
                <View style={{ flexDirection: "row", marginTop: 4 }}>
                  <View style={styles.kcalTag}>
                    <Text style={styles.kcalTagText}>{item.kcal} kcal</Text>
                  </View>
                  <View style={styles.proteinTag}>
                    <Text style={styles.proteinTagText}>{item.protein}g protein</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
        {/* Lịch trình hôm nay */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionFlag} />
            <Text style={styles.sectionTitle}>Lịch trình hôm nay</Text>
          </View>
          {todayMeals.map((item, idx) => (
            <View key={idx} style={styles.todayMealRow}>
              <Ionicons
                name={item.icon as any}
                size={28}
                color="#ffc107"
                style={{ marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.todayMealLabel}>{item.label}</Text>
                <Text style={styles.todayMealNote}>
                  {item.time} ({item.note})
                </Text>
              </View>
              {item.done ? (
                <Ionicons name="checkmark-circle" size={24} color="#00e676" />
              ) : (
                <Ionicons name="ellipse-outline" size={24} color="#bdbdbd" />
              )}
            </View>
          ))}
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
  planBox: {
    backgroundColor: "#00bcd4",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
    elevation: 1,
  },
  planTitle: { color: "#fff", fontWeight: "bold", fontSize: 16, marginBottom: 2 },
  planDate: { color: "#e0f7fa", fontSize: 13, marginBottom: 10 },
  planGoalRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00bcd4",
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },
  planGoalIcon: {
    marginRight: 10,
    backgroundColor: "#00e676",
    borderRadius: 16,
    padding: 6,
  },
  planGoalLabel: { color: "#fff", fontSize: 13 },
  planGoalValue: { color: "#fff", fontWeight: "bold", fontSize: 22 },
  progressBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    elevation: 1,
  },
  progressTitle: { color: "#00bcd4", fontWeight: "bold", fontSize: 15, marginBottom: 8 },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressCircleBox: { alignItems: "center", flex: 1 },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  progressPercent: { fontWeight: "bold", fontSize: 16, color: "#222" },
  progressLabel: { color: "#888", fontSize: 13 },
  sectionBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
    elevation: 1,
    marginBottom: 0,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionFlag: {
    width: 70,
    height: 22,
    backgroundColor: "#00bcd4",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: { color: "#00bcd4", fontWeight: "bold", fontSize: 15 },
  nextMealCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    elevation: 1,
  },
  nextMealImage: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
  nextMealName: { fontWeight: "bold", fontSize: 15, color: "#222" },
  nextMealType: { fontSize: 13, color: "#888", marginBottom: 4 },
  kcalTag: {
    backgroundColor: "#e0f7fa",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 8,
  },
  kcalTagText: { color: "#00bcd4", fontWeight: "bold", fontSize: 13 },
  proteinTag: {
    backgroundColor: "#e0f7fa",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  proteinTagText: { color: "#2196f3", fontWeight: "bold", fontSize: 13 },
  todayMealRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5fafd",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  todayMealLabel: { fontWeight: "bold", fontSize: 15, color: "#222" },
  todayMealNote: { fontSize: 13, color: "#888" },
});

export default DietTracking;
