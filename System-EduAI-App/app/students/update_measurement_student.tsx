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

const UpdateMeasurementStudent = () => {
  const router = useRouter();
  const [height, setHeight] = useState("110");
  const [weight, setWeight] = useState("30");

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#00bcd4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đo lường</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#00bcd4" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Chiều cao */}
        <Text style={styles.label}>Chiều cao (cm)</Text>
        <TextInput
          style={styles.input}
          placeholder="Chiều cao"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
        {/* Cân nặng */}
        <Text style={styles.label}>Cân nặng (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Cân nặng"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
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
    marginBottom: 12,
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

export default UpdateMeasurementStudent;
