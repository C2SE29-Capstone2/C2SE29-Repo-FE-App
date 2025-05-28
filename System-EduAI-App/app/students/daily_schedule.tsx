import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const days = [
  { label: "Thứ 2", date: 15 },
  { label: "Thứ 3", date: 16 },
  { label: "Thứ 4", date: 17 },
  { label: "Thứ 5", date: 18 },
  { label: "Thứ 6", date: 19 },
  { label: "Thứ 7", date: 20 },
  { label: "Chủ nhật", date: 21 },
];

const scheduleData = [
  {
    section: "Học tập",
    color: "#00bcd4",
    items: [
      {
        icon: require("../../assets/images/book.png"),
        title: "Nghe truyện",
        time: "8h15 : 9h",
      },
      {
        icon: require("../../assets/images/book.png"),
        title: "Bài tập đọc",
        time: "8h15 : 9h",
      },
    ],
  },
  {
    section: "Trò chơi",
    color: "#00bcd4",
    items: [
      {
        icon: require("../../assets/images/game.png"),
        title: "Trò chơi video",
        time: "1h30 : 2h30",
      },
      {
        icon: require("../../assets/images/game.png"),
        title: "Thể thao ngoài trời",
        time: "2h45 : 4h40",
      },
    ],
  },
  {
    section: "Giấc ngủ",
    color: "#00bcd4",
    items: [
      {
        icon: require("../../assets/images/sleep.png"),
        title: "Ngủ trưa",
        time: "11h : 11h",
      },
    ],
  },
  {
    section: "Ăn uống",
    color: "#00bcd4",
    items: [
      {
        icon: require("../../assets/images/food.png"),
        title: "Bữa sáng",
        time: "7h : 8h",
      },
      {
        icon: require("../../assets/images/food.png"),
        title: "Bữa trưa",
        time: "11h30 : 12h30",
      },
    ],
  },
];

const DailySchedule = () => {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(0);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerIconLeft}
        >
          <Ionicons name="arrow-back" size={24} color="#00bcd4" />
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#00bcd4"
            style={{ marginRight: 6 }}
            height={32}
          />
          <Text style={styles.headerTitle}>Lịch trình hằng ngày</Text>
        </View>
        <TouchableOpacity style={styles.headerIconRight}>
          <Ionicons name="notifications-outline" size={24} color="#00bcd4" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greetingRow}>
          <Image
            source={require("../../assets/images/student_2_nam.png")}
          
            style={styles.avatar}
          />
          <View>
            <Text style={styles.greetingText}>Chào Sarah!</Text>
            <Text style={styles.greetingSubText}>
              Kế hoạch của một ngày tuyệt vời!
            </Text>
          </View>
        </View>

        {/* Days */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysRow}
        >
          {days.map((d, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.dayBox,
                selectedDay === idx && styles.dayBoxActive,
              ]}
              onPress={() => setSelectedDay(idx)}
            >
              <Text
                style={[
                  styles.dayLabel,
                  selectedDay === idx && styles.dayLabelActive,
                ]}
              >
                {d.label}
              </Text>
              <Text
                style={[
                  styles.dayDate,
                  selectedDay === idx && styles.dayDateActive,
                ]}
              >
                {d.date}
              </Text>
              {selectedDay === idx && <View style={styles.dot} />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Nút + và tiêu đề */}
        <View style={styles.todayActivitiesRow}>
          <Text style={styles.todayActivitiesTitle}>Các hoạt động hôm nay</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/students/create_schedule" as any)}
          >
            <Ionicons name="add" size={24} color="#00bcd4" />
          </TouchableOpacity>
        </View>

        {/* Schedule Sections */}
        {scheduleData.map((section, idx) => (
          <View key={idx} style={styles.sectionBox}>
            <View
              style={[styles.sectionHeader, { backgroundColor: section.color }]}
            >
              <Text style={styles.sectionHeaderText}>{section.section}</Text>
            </View>
            {section.items.map((item, i) => (
              <View key={i} style={styles.itemRow}>
                <Image source={item.icon} style={styles.itemIcon} />
                <View>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 38,
    paddingHorizontal: 0,
    backgroundColor: "#e6fafd",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    height: 70,
    position: "relative",
  },
  headerIconLeft: {
    position: "absolute",
    left: 16,
    top: 38,
    zIndex: 2,
  },
  headerIconRight: {
    position: "absolute",
    right: 16,
    top: 38,
    zIndex: 2,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
  },
  headerTitle: {
    fontSize: 20,
    color: "#00bcd4",
    fontWeight: "bold",
    textAlign: "center",
    height: 40,
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
  container: { flex: 1, paddingHorizontal: 0 },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 10,
    marginLeft: 16,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 14 },
  greetingText: { fontSize: 20, fontWeight: "bold", color: "#222" },
  greetingSubText: { fontSize: 14, color: "#888" },
  daysRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 18,
    marginTop: 8,
  },
  dayBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minWidth: 60,
    position: "relative",
  },
  dayBoxActive: {
    backgroundColor: "#00bcd4",
    borderColor: "#00bcd4",
  },
  dayLabel: { color: "#888", fontWeight: "bold", fontSize: 15 },
  dayLabelActive: { color: "#fff" },
  dayDate: { color: "#888", fontWeight: "bold", fontSize: 17 },
  dayDateActive: { color: "#fff" },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 6,
    left: "50%",
    marginLeft: -3,
  },
  sectionBox: { marginBottom: 18, marginHorizontal: 16 },
  sectionHeader: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
    marginTop: 10,
  },
  sectionHeaderText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginLeft: 8,
  },
  itemIcon: { width: 32, height: 32, marginRight: 10 },
  itemTitle: { fontSize: 16, fontWeight: "bold", color: "#222" },
  itemTime: { fontSize: 14, color: "#888" },
  todayActivitiesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 8,
  },
  todayActivitiesTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#00bcd4",
    backgroundColor: "#e6fafd",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    flex: 1,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: "#00bcd4",
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
  },
});

export default DailySchedule;
