import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const GrowthReport = () => {
  const router = useRouter();
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#00bcd4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Báo cáo tăng trưởng</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#00bcd4" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Profile */}
      <View style={styles.profileBox}>
        <Image
          source={require("../../assets/images/student_2_nam.png")}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.profileName}>Phillip Lê</Text>
          <Text style={styles.profileAge}>Tuổi: 24</Text>
        </View>
      </View>
      {/* Height & Weight */}
      <View style={styles.hwRow}>
        <View style={[styles.hwBox, { backgroundColor: "#e0f7fa" }]}>
          <Text style={styles.hwLabel}>Chiều cao</Text>
          <Text style={styles.hwValue}>110 cm</Text>
          <Text style={styles.hwChange}>↑ +2.5 cm</Text>
        </View>
        <View style={[styles.hwBox, { backgroundColor: "#ede7f6" }]}>
          <Text style={styles.hwLabel}>Cân nặng</Text>
          <Text style={styles.hwValue}>19.5 Kg</Text>
          <Text style={styles.hwChange}>↑ +0.8 kg</Text>
        </View>
      </View>
      {/* Chart */}
      <View style={styles.chartBoxCustom}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Text style={styles.sectionTitle}>Tiến trình tăng trưởng</Text>
          <View style={styles.yellowDot} />
        </View>
        <View style={styles.chartBgCustom}>
          <View style={styles.chartBarRowCustom}>
            {/* Giai đoạn 1 */}
            <View style={styles.chartColCustom}>
              <View
                style={[
                  styles.barCustom,
                  {
                    height: 74,
                    backgroundColor: "#22C3E6",
                    left: 0,
                    borderRadius: 6,
                    bottom: 24,
                  },
                ]}
              />
              <View
                style={[
                  styles.barCustom,
                  {
                    height: 68,
                    backgroundColor: "#BDBDBD",
                    left: 28,
                    borderRadius: 6,
                    bottom: 24,
                  },
                ]}
              />
              <Text style={[styles.barValueCustom, { left: 0, bottom: 104 }]}>
                74
              </Text>
              <Text style={[styles.barValueCustom, { left: 28, bottom: 98 }]}>
                9.5
              </Text>
              <Text style={styles.chartColLabelCustom}>Giai đoạn 1</Text>
            </View>
            {/* Giai đoạn 2 */}
            <View style={styles.chartColCustom}>
              <View
                style={[
                  styles.barCustom,
                  {
                    height: 74,
                    backgroundColor: "#22C3E6",
                    left: 0,
                    borderRadius: 6,
                    bottom: 24,
                  },
                ]}
              />
              <View
                style={[
                  styles.barCustom,
                  {
                    height: 68,
                    backgroundColor: "#BDBDBD",
                    left: 28,
                    borderRadius: 6,
                    bottom: 24,
                  },
                ]}
              />
              <Text style={[styles.barValueCustom, { left: 0, bottom: 104 }]}>
                74
              </Text>
              <Text style={[styles.barValueCustom, { left: 28, bottom: 98 }]}>
                9.5
              </Text>
              <Text style={styles.chartColLabelCustom}>Giai đoạn 2</Text>
            </View>
            {/* Giai đoạn 3 */}
            <View style={styles.chartColCustom}>
              <View
                style={[
                  styles.barCustom,
                  {
                    height: 73,
                    backgroundColor: "#22C3E6",
                    left: 0,
                    borderRadius: 6,
                    bottom: 24,
                  },
                ]}
              />
              <View
                style={[
                  styles.barCustom,
                  {
                    height: 65,
                    backgroundColor: "#BDBDBD",
                    left: 28,
                    borderRadius: 6,
                    bottom: 24,
                  },
                ]}
              />
              <Text style={[styles.barValueCustom, { left: 0, bottom: 103 }]}>
                73
              </Text>
              <Text style={[styles.barValueCustom, { left: 28, bottom: 95 }]}>
                9.4
              </Text>
              <Text style={styles.chartColLabelCustom}>Giai đoạn 3</Text>
            </View>
          </View>
        </View>
        <View style={styles.chartLegendRowCustom}>
          <View style={styles.legendDotBlueCustom} />
          <Text style={styles.legendTextCustom}>Chiều cao</Text>
          <View style={styles.legendDotGrayCustom} />
          <Text style={styles.legendTextCustom}>Cân nặng</Text>
        </View>
      </View>
      {/* Stages */}
      <Text style={styles.stageTitle}>Giai đoạn tăng trưởng</Text>
      <View style={styles.stageBox}>
        <View style={styles.stageRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.stageLabel}>Giai đoạn 1 (0-12 tháng)</Text>
            <Text style={styles.stageInfo}>Chiều cao: 74 cm</Text>
            <Text style={styles.stageInfo}>Cân nặng: 9.5 kg</Text>
          </View>
          <View style={styles.stageStatusDone}>
            <Text style={styles.stageStatusText}>Hoàn thành</Text>
          </View>
        </View>
        <View style={styles.stageRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.stageLabel}>Giai đoạn 2 (1-3 năm)</Text>
            <Text style={styles.stageInfo}>Chiều cao: 96 cm</Text>
            <Text style={styles.stageInfo}>Cân nặng: 14.2 kg</Text>
          </View>
          <View style={styles.stageStatusDone}>
            <Text style={styles.stageStatusText}>Hoàn thành</Text>
          </View>
        </View>
        <View style={styles.stageRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.stageLabel}>Giai đoạn 3 (3-6 năm)</Text>
            <Text style={styles.stageInfo}>Chiều cao: 110 cm</Text>
            <Text style={styles.stageInfo}>Cân nặng: 19.5 kg</Text>
          </View>
          <View style={styles.stageStatusCurrent}>
            <Text style={styles.stageStatusCurrentText}>Hiện tại</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff", paddingTop: 18 },
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
  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    margin: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  profileName: { fontWeight: "bold", fontSize: 17, color: "#222" },
  profileAge: { color: "#888", fontSize: 14, marginTop: 2 },
  hwRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  hwBox: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    padding: 16,
    marginHorizontal: 6,
  },
  hwLabel: { color: "#888", fontWeight: "bold", fontSize: 14 },
  hwValue: { color: "#222", fontWeight: "bold", fontSize: 20, marginTop: 2 },
  hwChange: { color: "#00bcd4", fontSize: 13, marginTop: 2 },
  chartBoxCustom: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    margin: 16,
    marginTop: 4,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F2F2F2",
  },
  yellowDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFD600",
    marginRight: 2,
  },
  chartBgCustom: {
    backgroundColor: "#F8F9FB",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 0,
    marginTop: 2,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  chartBarRowCustom: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
    gap: 18,
  },
  chartColCustom: {
    width: 56,
    height: 100,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    marginHorizontal: 6,
    position: "relative",
  },
  barCustom: {
    position: "absolute",
    bottom: 0,
    width: 24,
    borderRadius: 0,
  },
  barValueCustom: {
    position: "absolute",
    color: "#222",
    fontWeight: "bold",
    fontSize: 13,
    width: 24,
    textAlign: "center",
  },
  chartColLabelCustom: {
    position: "absolute",
    bottom: -22,
    left: 0,
    width: 56,
    textAlign: "center",
    fontSize: 13,
    color: "#888",
  },
  chartLegendRowCustom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    marginBottom: 2,
  },
  legendDotBlueCustom: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#22C3E6",
    marginRight: 6,
  },
  legendDotGrayCustom: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E6E6EB",
    marginLeft: 18,
    marginRight: 6,
  },
  legendTextCustom: {
    fontSize: 15,
    color: "#888",
    marginRight: 8,
    fontWeight: "500",
  },
  stageTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 18,
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  stageBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    margin: 16,
    marginTop: 4,
    padding: 8,
    elevation: 1,
  },
  stageRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  stageLabel: { fontWeight: "bold", fontSize: 15, color: "#222" },
  stageInfo: { color: "#888", fontSize: 13 },
  stageStatusDone: {
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  stageStatusText: { color: "#4caf50", fontWeight: "bold", fontSize: 13 },
  stageStatusCurrent: {
    backgroundColor: "#ede7f6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  stageStatusCurrentText: {
    color: "#3f51b5",
    fontWeight: "bold",
    fontSize: 13,
  },
});

export default GrowthReport;
