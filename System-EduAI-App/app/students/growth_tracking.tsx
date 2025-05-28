import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const GrowthTracking = () => {
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  // Dữ liệu mẫu cho biểu đồ
  const chartData = [4, 7, 6, 9, 8, 7, 5, 8, 6, 4, 3, 2];
  const maxValue = Math.max(...chartData);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#00bcd4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theo dõi tăng trưởng</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#00bcd4" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Thông tin chiều cao/cân nặng */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Ionicons name="resize-outline" size={32} color="#00bcd4" />
            <Text style={styles.infoLabel}>Chiều cao</Text>
            <Text style={styles.infoValue}>1' 39"</Text>
          </View>
          <View style={styles.infoBox}>
            <Ionicons name="scale" size={32} color="#00bcd4" />
            <Text style={styles.infoLabel}>Cân nặng</Text>
            <Text style={styles.infoValue}>13 Kg</Text>
          </View>
        </View>

        {/* Tốc độ tăng trưởng */}
        <Text style={styles.sectionTitle}>Tốc độ tăng trưởng</Text>
        <View style={styles.chartBox}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTime}>23:19</Text>
            <Text style={styles.chartValue}>850 meters</Text>
          </View>
          <View style={styles.chartArea}>
            {chartData.map((v, i) => (
              <View
                key={i}
                style={[
                  styles.chartBar,
                  { height: (v / maxValue) * 80 || 2 },
                  i === chartData.length - 1 && styles.chartBarDashed,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Nhập dữ liệu tăng trưởng */}
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Nhập dữ liệu tăng trưởng</Text>
          <TouchableOpacity onPress={() => setShowInput((prev) => !prev)}>
            <Ionicons name={showInput ? "remove" : "add"} size={28} color="#00bcd4" />
          </TouchableOpacity>
        </View>
        {showInput && (
          <View style={styles.inputBox}>
            <Text style={styles.label}>Chiều cao (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập chiều cao"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
            <Text style={styles.label}>Cân nặng (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập cân nặng"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.saveBtn} onPress={() => setShowInput(false)}>
              <Text style={styles.saveBtnText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      {/* Nút xem báo cáo tăng trưởng */}
      <TouchableOpacity style={styles.reportBtn} onPress={() => router.push("/students/growth_report" as any)}>
        <Text style={styles.reportBtnText}>Xem báo cáo tăng trưởng</Text>
      </TouchableOpacity>
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
  scrollContent: { padding: 18, paddingBottom: 32 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#e0f7fa",
    borderRadius: 12,
    alignItems: "center",
    padding: 16,
    marginHorizontal: 6,
  },
  infoLabel: { color: "#00bcd4", fontWeight: "bold", fontSize: 15, marginTop: 4 },
  infoValue: { color: "#222", fontWeight: "bold", fontSize: 18, marginTop: 2 },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8, marginTop: 8 },
  chartBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    elevation: 2,
    padding: 14,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  chartTime: { color: "#222", fontSize: 13 },
  chartValue: { color: "#00bcd4", fontWeight: "bold", fontSize: 13 },
  chartArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 80,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  chartBar: {
    width: 10,
    backgroundColor: "#00bcd4",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  chartBarDashed: {
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#00bcd4",
    backgroundColor: "transparent",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  inputLabel: { flex: 1, fontWeight: "bold", fontSize: 15 },
  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 8,
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
    marginBottom: 8,
    color: "#222",
  },
  saveBtn: {
    backgroundColor: "#6EE05A",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  reportBtn: {
    backgroundColor: "#00bcd4",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 18,
    marginBottom: 18,
    marginTop: 8,
  },
  reportBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default GrowthTracking;
