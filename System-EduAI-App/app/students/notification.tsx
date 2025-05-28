import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const todayNoti = [
  {
    type: "recheck",
    title: "Tái khám!",
    time: "9:00",
    desc: "Thăm khám bệnh đậu mùa.",
    icon: require("../../assets/images/doctor.png"),
    color: "#e3edff",
    borderColor: "#b3cfff",
    textColor: "#3a5fc8",
    timeBg: "#b3cfff",
  },
  {
    type: "meeting",
    title: "Họp lớp!",
    time: "9:00",
    desc: "Họp lớp mầm A1 🧩🍎",
    icon: require("../../assets/images/class_meeting.png"),
    color: "#fff7e3",
    borderColor: "#ffe0b2",
    textColor: "#e67c00",
    timeBg: "#ffe0b2",
  },
  {
    type: "breakfast",
    title: "Bữa sáng!",
    time: "9:00",
    desc: "Uống sữa, tập đọc",
    icon: null,
    iconName: "sunny",
    iconColor: "#ffb300",
    color: "#e3edff",
    borderColor: "#b3cfff",
    textColor: "#3a5fc8",
    timeBg: "#b3cfff",
  },
  {
    type: "lunch",
    title: "Bữa trưa!",
    time: "9:00",
    desc: "Hỗn hợp rau củ 🧩🍎",
    icon: null,
    iconName: "sunny",
    iconColor: "#ffb300",
    color: "#fff7e3",
    borderColor: "#ffe0b2",
    textColor: "#e67c00",
    timeBg: "#ffe0b2",
  },
];

const recentNoti = [
  {
    type: "meeting",
    title: "Lịch họp!",
    time: "9:00",
    desc: "Lớp lá B1",
    icon: require("../../assets/images/class_meeting.png"),
    color: "#ededed",
    borderColor: "#bdbdbd",
    textColor: "#888",
    timeBg: "#bdbdbd",
    gray: true,
  },
  {
    type: "afternoon",
    title: "Bữa chiều!",
    time: "9:00",
    desc: "Đọc sách, uống sữa",
    icon: null,
    iconName: "cloudy",
    iconColor: "#ffb300",
    color: "#e3edff",
    borderColor: "#b3cfff",
    textColor: "#3a5fc8",
    timeBg: "#b3cfff",
  },
  {
    type: "activity",
    title: "Quản lý các hoạt động!",
    time: "9:00",
    desc: "Các hoạt động tập đọc, vui chơi...",
    icon: require("../../assets/images/activity.png"),
    color: "#fff7e3",
    borderColor: "#ffe0b2",
    textColor: "#e67c00",
    timeBg: "#ffe0b2",
  },
  {
    type: "leave",
    title: "Võ Văn Mạnh",
    time: "9:00",
    desc: "ID: 2025001",
    icon: require("../../assets/images/student_1.png"),
    color: "#e3edff",
    borderColor: "#b3cfff",
    textColor: "#3a5fc8",
    timeBg: "#b3cfff",
    status: "Rời trường",
    statusColor: "#ff5252",
  },
  {
    type: "enter",
    title: "Lê Trần Ninh",
    time: "9:00",
    desc: "ID: 2025001",
    icon: require("../../assets/images/student_2.png"),
    color: "#fff7e3",
    borderColor: "#ffe0b2",
    textColor: "#e67c00",
    timeBg: "#ffe0b2",
    status: "Vào trường",
    statusColor: "#00e676",
  },
  {
    type: "dinner",
    title: "Bữa tối!",
    time: "9:00",
    desc: "Uống sữa",
    icon: require("../../assets/images/dinner.png"),
    color: "#ededed",
    borderColor: "#bdbdbd",
    textColor: "#888",
    timeBg: "#bdbdbd",
    gray: true,
  },
];

const NotificationScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#00bcd4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <TouchableOpacity style={styles.headerNotif}>
          <Ionicons name="notifications" size={24} color="#00bcd4" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>10</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Hôm nay */}
        <View style={styles.sectionRow}>
          <View style={styles.sectionFlag}>
            <Text style={styles.sectionFlagText}>Hôm nay</Text>
          </View>
        </View>
        {todayNoti.map((item, idx) => (
          <View
            key={idx}
            style={[
              styles.notiCard,
              {
                backgroundColor: item.color,
                borderColor: item.borderColor,
              },
            ]}
          >
            <View style={styles.notiCardRow}>
              {item.icon ? (
                <Image source={item.icon} style={styles.notiIconImg} />
              ) : (
                <Ionicons
                  name={item.iconName as any}
                  size={32}
                  color={item.iconColor}
                  style={{ marginRight: 10 }}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.notiTitle, { color: item.textColor }]}>{item.title}</Text>
                <Text style={styles.notiDesc}>{item.desc}</Text>
              </View>
              <View style={[styles.notiTimeBox, { backgroundColor: item.timeBg }]}>
                <Text style={styles.notiTime}>{item.time}</Text>
              </View>
            </View>
          </View>
        ))}
        {/* Gần đây */}
        <View style={styles.sectionRow}>
          <View style={[styles.sectionFlag, { backgroundColor: "#00ccb4" }]}>
            <Text style={styles.sectionFlagText}>Gần đây</Text>
          </View>
        </View>
        {recentNoti.map((item, idx) => (
          <View
            key={idx}
            style={[
              styles.notiCard,
              {
                backgroundColor: item.color,
                borderColor: item.borderColor,
              },
            ]}
          >
            <View style={styles.notiCardRow}>
              {item.icon ? (
                <Image source={item.icon} style={styles.notiIconImg} />
              ) : (
                <Ionicons
                  name={item.iconName as any}
                  size={32}
                  color={item.iconColor}
                  style={{ marginRight: 10 }}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.notiTitle, { color: item.textColor }]}>{item.title}</Text>
                <Text style={styles.notiDesc}>{item.desc}</Text>
                {item.status && (
                  <View style={[styles.statusTag, { backgroundColor: item.statusColor }]}>
                    <Text style={styles.statusTagText}>{item.status}</Text>
                  </View>
                )}
              </View>
              <View style={[styles.notiTimeBox, { backgroundColor: item.timeBg }]}>
                <Text style={styles.notiTime}>{item.time}</Text>
              </View>
            </View>
          </View>
        ))}
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
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#00ccb4" },
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
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  sectionFlag: {
    backgroundColor: "#00ccb4",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionFlagText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  notiCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 14,
    elevation: 0,
  },
  notiCardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  notiIconImg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  notiTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  notiDesc: {
    color: "#888",
    fontSize: 13,
    marginBottom: 2,
  },
  notiTimeBox: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    minWidth: 48,
  },
  notiTime: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  statusTag: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 4,
  },
  statusTagText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default NotificationScreen;
