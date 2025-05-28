import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const StudyStatistic = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#00bcd4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thống kê học tập</Text>
        <TouchableOpacity style={styles.headerNotif}>
          <Ionicons name="notifications" size={24} color="#00bcd4" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Điểm học tập */}
        <View style={styles.scoreBox}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.scoreLabel}>Điểm học tập</Text>
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <Text style={styles.scoreValue}>92</Text>
                <Text style={styles.scoreUnit}>điểm</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <Ionicons name="trending-up" size={16} color="#00e676" />
                <Text style={styles.scoreChange}>+12 tháng này</Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="brain"
              size={38}
              color="#ffe600"
              style={{ marginLeft: 8 }}
            />
          </View>
          <View style={styles.scoreBarBg}>
            <View style={[styles.scoreBar, { width: "92%" }]} />
          </View>
          <Text style={styles.scorePercent}>92%</Text>
        </View>
        {/* Thống kê chi tiết */}
        <View style={styles.sectionFlagRow}>
          <View style={styles.sectionFlag} />
          <Text style={styles.sectionFlagText}>Thống kê chi tiết</Text>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailCard}>
            <Ionicons
              name="book"
              size={22}
              color="#ff9800"
              style={{ marginBottom: 6 }}
            />
            <Text style={styles.detailCardLabel}>Học tập</Text>
            <Text style={styles.detailCardValue}>24.5 giờ</Text>
            <Text style={styles.detailCardSub}>+2,3h so với tháng trước</Text>
          </View>
          <View style={styles.detailCard}>
            <Ionicons
              name="eye"
              size={22}
              color="#2196f3"
              style={{ marginBottom: 6 }}
            />
            <Text style={styles.detailCardLabel}>Độ tập trung</Text>
            <Text style={styles.detailCardValue}>8.5/10</Text>
            <Text style={styles.detailCardSub}>Top 15% trong nhóm tuổi</Text>
          </View>
        </View>
        {/* Thời gian hiệu suất tốt nhất */}
        <View style={styles.sectionFlagRow}>
          <View style={styles.sectionFlag} />
          <Text style={styles.sectionFlagText}>Thống kê chi tiết</Text>
        </View>
        <View style={styles.bestTimeBox}>
          <Text style={styles.bestTimeLabel}>Thời gian hiệu suất tốt nhất</Text>
          <View style={styles.bestTimeRow}>
            <Ionicons
              name="sunny"
              size={18}
              color="#ffb300"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.bestTimeText}>Buổi sáng</Text>
            <View style={styles.bestTimeBarBg}>
              <View style={[styles.bestTimeBar, { width: "80%" }]} />
            </View>
          </View>
          <View style={styles.bestTimeRow}>
            <Ionicons
              name="partly-sunny"
              size={18}
              color="#ffb300"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.bestTimeText}>Buổi chiều</Text>
            <View style={styles.bestTimeBarBg}>
              <View style={[styles.bestTimeBar, { width: "60%" }]} />
            </View>
          </View>
          <View style={styles.bestTimeRow}>
            <Ionicons
              name="moon"
              size={18}
              color="#ffb300"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.bestTimeText}>Buổi tối</Text>
            <View style={styles.bestTimeBarBg}>
              <View style={[styles.bestTimeBar, { width: "40%" }]} />
            </View>
          </View>
        </View>
        {/* Phân tích nhóm tuổi */}
        <View style={styles.sectionFlagRow}>
          <View style={styles.sectionFlag} />
          <Text style={styles.sectionFlagText}>Phân tích nhóm tuổi</Text>
        </View>
        <View style={styles.rankBox}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Text style={styles.rankLabel}>Xếp hạng chung</Text>
            <Text style={styles.rankTop}>Top 15%</Text>
            <Text style={styles.rankScore}>92/100</Text>
          </View>
          <View style={styles.rankBarBg}>
            <View style={[styles.rankBar, { width: "92%" }]} />
            <View style={styles.rankBarAvg} />
          </View>
          <View style={styles.rankBarLegendRow}>
            <Text style={styles.rankBarLegendLeft}>0</Text>
            <Text style={styles.rankBarLegendMid}>Trung bình: 77</Text>
            <Text style={styles.rankBarLegendRight}>100</Text>
          </View>
          {/* Phân tích kỹ năng */}
          <View style={styles.skillRow}>
            <Ionicons
              name="analytics"
              size={18}
              color="#8e24aa"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.skillLabel}>Tư duy phản biện</Text>
            <View style={styles.skillBarBg}>
              <View
                style={[
                  styles.skillBar,
                  { width: "95%", backgroundColor: "#8e24aa" },
                ]}
              />
            </View>
            <Text style={styles.skillPercent}>95%</Text>
          </View>
          <View style={styles.skillRow}>
            <Ionicons
              name="construct"
              size={18}
              color="#26a69a"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.skillLabel}>Giải quyết vấn đề</Text>
            <View style={styles.skillBarBg}>
              <View
                style={[
                  styles.skillBar,
                  { width: "88%", backgroundColor: "#26a69a" },
                ]}
              />
            </View>
            <Text style={styles.skillPercent}>88%</Text>
          </View>
          <View style={styles.skillRow}>
            <Ionicons
              name="chatbubbles"
              size={18}
              color="#ff7043"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.skillLabel}>Giao tiếp</Text>
            <View style={styles.skillBarBg}>
              <View
                style={[
                  styles.skillBar,
                  { width: "82%", backgroundColor: "#ff7043" },
                ]}
              />
            </View>
            <Text style={styles.skillPercent}>82%</Text>
          </View>
        </View>
        {/* Tốc độ học tập */}
        <View style={styles.speedBoxCustom}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.speedTitleCustom}>Tốc độ học tập</Text>
          </View>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <Ionicons
                name="rocket"
                size={20}
                color="#22C3E6"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.speedHighlightCustom}>
                Nhanh hơn 30% so với trung bình
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("students/study_speed_analysis" as never)}
            >
              <Text style={styles.speedDetailCustom}>
                Phân tích tốc độ học tập
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.speedBarRowCustom}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <View style={styles.speedBarBgCustom}>
                <View style={[styles.speedBarCustom, { width: "80%" }]} />
              </View>
              <Text style={styles.speedBarLabelCustom}>Con của bạn</Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <View style={styles.speedBarBgCustom}>
                <View
                  style={[
                    styles.speedBarCustom,
                    { width: "50%", backgroundColor: "#bdbdbd" },
                  ]}
                />
              </View>
              <Text style={styles.speedBarLabelCustom}>Nhóm tuổi</Text>
            </View>
          </View>
        </View>
        {/* Khuyến nghị */}
        <View style={styles.recommendBox}>
          <Text style={styles.recommendTitle}>Khuyến nghị</Text>
          <View style={styles.recommendRow}>
            <Ionicons
              name="checkmark"
              size={18}
              color="#00bcd4"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.recommendText}>
              Tiếp tục với các bài toán nâng cao
            </Text>
          </View>
          <View style={styles.recommendRow}>
            <Ionicons
              name="checkmark"
              size={18}
              color="#00bcd4"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.recommendText}>
              Tập trung nhiều hơn vào các bài tập viết sáng tạo
            </Text>
          </View>
          <View style={styles.recommendRow}>
            <Ionicons
              name="checkmark"
              size={18}
              color="#00bcd4"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.recommendText}>
              Tham gia các nhóm học tập ngang hàng
            </Text>
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
  scoreBox: {
    backgroundColor: "#00bcd4",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
    padding: 18,
    elevation: 1,
  },
  scoreLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
  },
  scoreValue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 36,
    marginRight: 6,
  },
  scoreUnit: { color: "#fff", fontSize: 15, marginBottom: 6 },
  scoreChange: {
    color: "#00e676",
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 4,
  },
  scoreBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0f7fa",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 2,
  },
  scoreBar: {
    height: 8,
    backgroundColor: "#ffe600",
    borderRadius: 6,
  },
  scorePercent: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    alignSelf: "flex-end",
  },
  sectionFlagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 4,
    marginHorizontal: 16,
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
  sectionFlagText: { color: "#00bcd4", fontWeight: "bold", fontSize: 15 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  detailCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginRight: 8,
    elevation: 1,
    alignItems: "center",
  },
  detailCardLabel: { color: "#888", fontSize: 13, marginBottom: 2 },
  detailCardValue: { color: "#222", fontWeight: "bold", fontSize: 18 },
  detailCardSub: { color: "#00bcd4", fontSize: 12, marginTop: 2 },
  bestTimeBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    elevation: 1,
  },
  bestTimeLabel: {
    color: "#888",
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "bold",
  },
  bestTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bestTimeText: { color: "#222", fontSize: 14, width: 90 },
  bestTimeBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#e0f7fa",
    borderRadius: 6,
    overflow: "hidden",
    marginLeft: 8,
  },
  bestTimeBar: {
    height: 8,
    backgroundColor: "#ffe600",
    borderRadius: 6,
  },
  rankBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    elevation: 1,
  },
  rankLabel: { color: "#888", fontSize: 13, marginRight: 8 },
  rankTop: {
    color: "#00bcd4",
    fontWeight: "bold",
    fontSize: 13,
    marginRight: 8,
  },
  rankScore: { color: "#222", fontWeight: "bold", fontSize: 15 },
  rankBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0f7fa",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 6,
    marginBottom: 2,
    position: "relative",
  },
  rankBar: {
    height: 8,
    backgroundColor: "#00bcd4",
    borderRadius: 6,
    position: "absolute",
    left: 0,
    top: 0,
  },
  rankBarAvg: {
    position: "absolute",
    left: "77%",
    top: -4,
    width: 2,
    height: 16,
    backgroundColor: "#ffe600",
    borderRadius: 1,
  },
  rankBarLegendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 8,
  },
  rankBarLegendLeft: { color: "#888", fontSize: 12 },
  rankBarLegendMid: { color: "#888", fontSize: 12, textAlign: "center" },
  rankBarLegendRight: { color: "#888", fontSize: 12 },
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  skillLabel: { color: "#222", fontSize: 14, width: 120 },
  skillBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#e0f7fa",
    borderRadius: 6,
    overflow: "hidden",
    marginLeft: 8,
    marginRight: 8,
  },
  skillBar: {
    height: 8,
    borderRadius: 6,
  },
  skillPercent: {
    color: "#888",
    fontWeight: "bold",
    fontSize: 13,
    width: 40,
    textAlign: "right",
  },
  speedBoxCustom: {
    backgroundColor: "#f5fafd",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
    elevation: 0,
    marginTop: 10,
  },
  speedTitleCustom: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    marginBottom: 6,
  },
  speedHighlightCustom: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 15,
  },
  speedDetailCustom: {
    color: "#2979ff",
    fontWeight: "bold",
    fontSize: 10,
    marginLeft: 12,
    height: 30,
  },
  speedBarRowCustom: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 18,
    gap: 8,
  },
  speedBarBgCustom: {
    width: "90%",
    height: 6,
    backgroundColor: "#e0e7ef",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 4,
  },
  speedBarCustom: {
    height: 6,
    backgroundColor: "#2979ff",
    borderRadius: 6,
  },
  speedBarLabelCustom: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },
  recommendBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 24,
    padding: 14,
    elevation: 1,
  },
  recommendTitle: {
    color: "#00bcd4",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 8,
  },
  recommendRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  recommendText: { color: "#0097a7", fontSize: 13, flex: 1 },
});

export default StudyStatistic;
