import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function AccessControl() {
  // Dữ liệu mẫu cho các lớp
  const classData = [
    {
      group: "Lớp mầm",
      classes: [
        { name: "Nur-A1", count: "18/20", teacher: "Lê Trần Ninh", status: "green" },
        { name: "Nur-A2", count: "10/20", teacher: "Lê Đình Thịnh", status: "yellow" },
        { name: "Nur-A3", count: "20/25", teacher: "Lê Trần Ninh", status: "green" },
      ],
    },
    {
      group: "Lớp chồi",
      classes: [
        { name: "PreK-A1", count: "6/20", teacher: "Lê Trần Ninh", status: "red" },
        { name: "PreK-A2", count: "18/20", teacher: "Võ Văn Mạnh", status: "green" },
      ],
    },
    {
      group: "Lớp lá",
      classes: [
        { name: "KG-A1", count: "18/20", teacher: "Lê Trần Ninh", status: "green" },
        { name: "KG-A1", count: "13/20", teacher: "Lê Trần Ninh", status: "yellow" },
        { name: "KG-A1", count: "18/20", teacher: "Lê Trần Ninh", status: "green" },
        { name: "KG-A1", count: "6/20", teacher: "Lê Trần Ninh", status: "red" },
      ],
    },
  ];

  // Helper cho style
  const getStatusBorder = (status: "green" | "yellow" | "red") =>
    status === "green" ? "green" : status === "yellow" ? "yellow" : "red";
  const getStatusCountBg = (status: "green" | "yellow" | "red") =>
    status === "green" ? "greenCount" : status === "yellow" ? "yellowCount" : "redCount";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={28} color="#1A3442" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kiểm soát lớp học</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ marginRight: 8 }}>
            <MaterialIcons name="notifications-active" size={28} color="#06b6d4" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }}>
        {/* Card chào buổi sáng */}
        <View style={styles.greetingCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.greetingIconBox}>
              <MaterialIcons name="wb-sunny" size={32} color="#FFD600" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.greetingTitle}>Chào buổi sáng!</Text>
              <Text style={styles.greetingSubtitle}>Hãy bắt đầu một ngày tuyệt vời!</Text>
            </View>
          </View>
        </View>
        {/* Danh sách lớp */}
        {classData.map((group, idx) => (
          <View key={group.group} style={{ marginBottom: 8, opacity: group.group === "Lớp mầm" ? 1 : 0.3 }}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupHeaderText}>{group.group}</Text>
            </View>
            <View style={styles.classRow}>
              {group.classes.map((cls, i) => (
                cls.name === "Nur-A1" ? (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.7}
                    onPress={() => router.push("parents/nur_a1_class" as any)}
                  >
                    <View style={[styles.classCard, styles[getStatusBorder(cls.status as "green"|"yellow"|"red")]]}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.className}>{cls.name}</Text>
                        <View style={[styles.classCountBox, styles[getStatusCountBg(cls.status as "green"|"yellow"|"red")]]}>
                          <Text style={styles.classCountText}>{cls.count}</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                        <MaterialIcons name="person" size={16} color="#06b6d4" />
                        <Text style={styles.classTeacher}>{cls.teacher}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View key={i} style={[styles.classCard, styles[getStatusBorder(cls.status as "green"|"yellow"|"red")]]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.className}>{cls.name}</Text>
                      <View style={[styles.classCountBox, styles[getStatusCountBg(cls.status as "green"|"yellow"|"red")]]}>
                        <Text style={styles.classCountText}>{cls.count}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                      <MaterialIcons name="person" size={16} color="#06b6d4" />
                      <Text style={styles.classTeacher}>{cls.teacher}</Text>
                    </View>
                  </View>
                )
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6fafd' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#06b6d4',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  notificationText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  greetingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 18,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#e0f7fa',
  },
  greetingIconBox: {
    backgroundColor: '#fffde7',
    borderRadius: 32,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#06b6d4',
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#1A3442',
    marginTop: 2,
  },
  groupHeader: {
    marginLeft: 16,
    marginBottom: 8,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupHeaderText: {
    backgroundColor: '#14b8a6',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    letterSpacing: 0.2,
  },
  classRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 0,
    marginBottom: 8,
    justifyContent: 'flex-start',
    gap: 0,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginLeft: 16,
    marginBottom: 18,
    width: 160,
    elevation: 0,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: '#e0f7fa',
  },
  className: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1A3442',
    marginBottom: 8,
  },
  classCountBox: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginLeft: 8,
    minWidth: 48,
    alignItems: 'center',
    marginBottom: 0,
  },
  classCountText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#fff',
  },
  classTeacher: {
    fontSize: 15,
    color: '#1A3442',
    marginLeft: 4,
    marginTop: 2,
  },
  green: { borderColor: '#14b8a6' },
  yellow: { borderColor: '#FFD600' },
  red: { borderColor: '#ef4444' },
  greenCount: { backgroundColor: '#14b8a6' },
  yellowCount: { backgroundColor: '#FFD600' },
  redCount: { backgroundColor: '#ef4444' },
});
