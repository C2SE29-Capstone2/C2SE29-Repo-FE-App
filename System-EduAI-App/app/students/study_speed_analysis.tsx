import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const StudySpeedAnalysis = () => {
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
        <Text style={styles.headerTitle}>Phân tích tốc độ học tập</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#00bcd4" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Box tổng quan */}
      <View style={styles.overviewBox}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text style={styles.overviewTitle}>
            Nhanh hơn <Text style={{ color: "#00bcd4" }}>30%</Text>
          </Text>
          <MaterialCommunityIcons
            name="rocket-launch"
            size={28}
            color="#00bcd4"
            style={{ marginLeft: 8 }}
          />
        </View>
        <Text style={styles.overviewSub}>hơn trung bình nhóm tuổi</Text>
        <View style={styles.progressBox}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Con của bạn</Text>
            <Text style={styles.progressPercent}>80%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBar, { width: "80%" }]} />
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Trung bình nhóm tuổi</Text>
            <Text style={styles.progressPercent}>50%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBar,
                { width: "50%", backgroundColor: "#bdbdbd" },
              ]}
            />
          </View>
        </View>
      </View>
      {/* Tiến độ hàng tháng */}
      <View style={styles.sectionFlagRow}>
        <View style={styles.sectionFlag} />
        <Text style={styles.sectionFlagText}>Tiến độ hàng tháng</Text>
        <View style={styles.yellowDot} />
      </View>
      <View style={styles.monthBox}>
        <View style={styles.monthRow}>
          <Text style={styles.monthLabel}>Tháng 1</Text>
          <Text style={styles.monthCurrent}>Hiện tại</Text>
          <Text style={styles.monthPercent}>80%</Text>
        </View>
        <View style={styles.monthRow}>
          <Text style={styles.monthLabel}>Tháng 12</Text>
          <Text style={styles.monthPercent}>75%</Text>
        </View>
        <View style={styles.monthRow}>
          <Text style={styles.monthLabel}>Tháng 11</Text>
          <Text style={styles.monthPercent}>70%</Text>
        </View>
        <View style={styles.improveRow}>
          <Ionicons
            name="trending-up"
            size={16}
            color="#00bcd4"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.improveText}>Cải tiến ổn định</Text>
        </View>
      </View>
      {/* Tốc độ học theo chủ đề */}
      <View style={styles.sectionFlagRow}>
        <View style={styles.sectionFlag} />
        <Text style={styles.sectionFlagText}>Tốc độ học theo chủ đề</Text>
        <View style={styles.yellowDot} />
      </View>
      <View style={styles.topicBox}>
        {/* Toán học */}
        <View style={styles.topicRow}>
          <View style={styles.topicIconBox}>
            <Ionicons name="calculator" size={24} color="#22C3E6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.topicLabel}>Toán học</Text>
            <View style={styles.topicBarBg}>
              <View
                style={[
                  styles.topicBar,
                  { width: "80%", backgroundColor: "#22C3E6" },
                ]}
              />
            </View>
          </View>
          <Text style={styles.topicFast}>Nhanh hơn 35%</Text>
        </View>
        {/* Đọc */}
        <View style={styles.topicRow}>
          <View style={styles.topicIconBox}>
            <Ionicons name="book" size={24} color="#A259FF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.topicLabel}>Đọc</Text>
            <View style={styles.topicBarBg}>
              <View
                style={[
                  styles.topicBar,
                  { width: "75%", backgroundColor: "#A259FF" },
                ]}
              />
            </View>
          </View>
          <Text style={[styles.topicFast, { color: "#A259FF" }]}>
            Nhanh hơn 25%
          </Text>
        </View>
        {/* Thể thao */}
        <View style={styles.topicRow}>
          <View style={styles.topicIconBox}>
            <Ionicons name="tennisball" size={24} color="#00B686" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.topicLabel}>Thể thao</Text>
            <View style={styles.topicBarBg}>
              <View
                style={[
                  styles.topicBar,
                  { width: "70%", backgroundColor: "#00B686" },
                ]}
              />
            </View>
          </View>
          <Text style={[styles.topicFast, { color: "#00B686" }]}>
            Nhanh hơn 28%
          </Text>
        </View>
      </View>
      {/* Mẹo để duy trì tốc độ */}
      <View style={styles.sectionFlagRow}>
        <View style={styles.sectionFlag} />
        <Text style={styles.sectionFlagText}>Mẹo để duy trì tốc độ</Text>
        <View style={styles.yellowDot} />
      </View>
      <View style={styles.tipBox}>
        <View style={styles.tipRow}>
          <Ionicons
            name="time"
            size={20}
            color="#2979ff"
            style={{ marginRight: 10 }}
          />
          <View>
            <Text style={styles.tipTitle}>Thực hành thường xuyên</Text>
            <Text style={styles.tipDesc}>
              Duy trì lịch học tập nhất quán để ghi nhớ tốt hơn
            </Text>
          </View>
        </View>
        <View style={styles.tipRow}>
          <Ionicons
            name="flash"
            size={20}
            color="#A259FF"
            style={{ marginRight: 10 }}
          />
          <View>
            <Text style={styles.tipTitle}>Học tập tích cực</Text>
            <Text style={styles.tipDesc}>
              Tham gia các bài tập tương tác và thảo luận
            </Text>
          </View>
        </View>
        <View style={styles.tipRow}>
          <Ionicons
            name="hand-left"
            size={20}
            color="#00B686"
            style={{ marginRight: 10 }}
          />
          <View>
            <Text style={styles.tipTitle}>Học tập tích cực</Text>
            <Text style={styles.tipDesc}>
              Tham gia các bài tập tương tác và thảo luận
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5fafd" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#00bcd4" },
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
  overviewBox: {
    backgroundColor: "#e0f7fa",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
    padding: 18,
    elevation: 1,
  },
  overviewTitle: { color: "#222", fontWeight: "bold", fontSize: 20, flex: 1 },
  overviewSub: { color: "#888", fontSize: 15, marginBottom: 10 },
  progressBox: { marginTop: 8, marginBottom: 2 },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  progressLabel: { color: "#888", fontSize: 14 },
  progressPercent: { color: "#00bcd4", fontWeight: "bold", fontSize: 15 },
  progressBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#00bcd4",
    borderRadius: 6,
  },
  sectionFlagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 4,
    marginHorizontal: 16,
  },
  sectionFlag: {
    width: 120,
    height: 22,
    backgroundColor: "#00bcd4",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionFlagText: { color: "#00bcd4", fontWeight: "bold", fontSize: 15 },
  yellowDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFD600",
    marginLeft: 8,
  },
  monthBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 10,
    elevation: 1,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  monthLabel: { color: "#222", fontSize: 15 },
  monthCurrent: {
    color: "#00bcd4",
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 8,
  },
  monthPercent: { color: "#00bcd4", fontWeight: "bold", fontSize: 15 },
  improveRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 2,
  },
  improveText: { color: "#00bcd4", fontWeight: "bold", fontSize: 14 },
  topicBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 10,
    elevation: 1,
  },
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  topicIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#f5fafd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  topicLabel: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 4,
  },
  topicBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 2,
    marginBottom: 2,
  },
  topicBar: {
    height: 8,
    borderRadius: 6,
  },
  topicFast: {
    color: "#00bcd4",
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 8,
  },
  tipBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 24,
    padding: 14,
    elevation: 1,
  },
  tipRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  tipTitle: { color: "#222", fontWeight: "bold", fontSize: 15 },
  tipDesc: { color: "#888", fontSize: 13, marginTop: 2 },
});

export default StudySpeedAnalysis;
