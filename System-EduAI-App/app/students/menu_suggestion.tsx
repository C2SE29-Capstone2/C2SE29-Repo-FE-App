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
import { useRouter } from "expo-router";

const menuData = [
  {
    title: "Buổi sáng",
    time: "8:00",
    items: [
      {
        name: "Bột yến mạch...",
        kcal: 320,
        image: require("../../assets/images/breakfast_1.png"),
      },
      {
        name: "Sữa",
        kcal: 150,
        image: require("../../assets/images/breakfast_2.png"),
      },
    ],
  },
  {
    title: "Buổi trưa",
    time: "12:30",
    items: [
      {
        name: "Pasta vui vẻ",
        kcal: 380,
        image: require("../../assets/images/lunch_1.png"),
      },
      {
        name: "Hỗn hợp rau củ",
        kcal: 120,
        image: require("../../assets/images/lunch_2.png"),
      },
    ],
  },
  {
    title: "Đồ ăn vặt",
    time: "15:30",
    items: [
      {
        name: "Sữa chua",
        kcal: 200,
        image: require("../../assets/images/snack_1.png"),
      },
    ],
  },
  {
    title: "Bữa tối",
    time: "18:30",
    items: [
      {
        name: "Gà hạnh phúc",
        kcal: 350,
        image: require("../../assets/images/dinner_1.png"),
      },
      {
        name: "Trái cây",
        kcal: 100,
        image: require("../../assets/images/dinner_2.png"),
      },
    ],
  },
];

const MenuSuggestion = () => {
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#00bcd4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gợi ý thực đơn</Text>
        <TouchableOpacity style={styles.headerNotif}>
          <Ionicons name="notifications" size={24} color="#00bcd4" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Nút chuyển sang trang Theo dõi chế độ ăn uống */}
      <TouchableOpacity
        style={styles.dietTrackingBtn}
        onPress={() => router.push("/students/diet_tracking" as any)}
      >
        <Ionicons name="trending-up" size={18} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.dietTrackingBtnText}>Theo dõi chế độ ăn uống</Text>
      </TouchableOpacity>
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
        {/* Thông tin thực đơn */}
        <View style={styles.menuInfoBox}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
            <Ionicons name="alert-circle" size={18} color="#00bcd4" style={{ marginRight: 6 }} />
            <Text style={styles.menuInfoTitle}>Thông tin thực đơn</Text>
          </View>
          <Text style={styles.menuInfoText}>
            Phù hợp với lứa tuổi: được thiết kế đặc biệt cho 4-6 tuổi
          </Text>
          <Text style={styles.menuInfoText}>
            Tổng lượng calo: 1620 kcal (Khuyến nghị: 1400-1600)
          </Text>
          <Text style={styles.menuInfoText}>
            Dinh dưỡng cân bằng: 50% carbs, 30% protein, 20% chất béo
          </Text>
        </View>
        {/* Các bữa ăn */}
        {menuData.map((meal, idx) => (
          <View key={idx} style={styles.mealBox}>
            <View style={styles.mealHeader}>
              <View style={styles.mealLabelRow}>
                <View style={styles.mealLabelDot} />
                <Text style={styles.mealLabel}>{meal.title}</Text>
              </View>
              <Text style={styles.mealTime}>{meal.time}</Text>
            </View>
            <View style={styles.mealItemsRow}>
              {meal.items.map((item, i) => (
                <View key={i} style={styles.mealItemCard}>
                  <Image source={item.image} style={styles.mealItemImage} />
                  <Text style={styles.mealItemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.mealItemKcal}>{item.kcal} kcal</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
        {/* Lời khuyên hữu ích */}
        <View style={styles.tipsBox}>
          <View style={styles.tipsHeaderRow}>
            <View style={styles.mealLabelDot} />
            <Text style={styles.tipsHeader}>Lời khuyên hữu ích</Text>
          </View>
          <View style={{ marginTop: 8 }}>
            <View style={styles.tipRow}>
              <Ionicons name="checkmark" size={18} color="#00bcd4" style={{ marginRight: 6 }} />
              <Text style={styles.tipText}>Phục vụ các món ăn nhiều màu sắc để làm cho bữa ăn trở nên thú vị</Text>
            </View>
            <View style={styles.tipRow}>
              <Ionicons name="checkmark" size={18} color="#00bcd4" style={{ marginRight: 6 }} />
              <Text style={styles.tipText}>Duy trì giờ ăn đều đặn</Text>
            </View>
            <View style={styles.tipRow}>
              <Ionicons name="checkmark" size={18} color="#00bcd4" style={{ marginRight: 6 }} />
              <Text style={styles.tipText}>Khuyến khích uống nước giữa các bữa ăn</Text>
            </View>
            <View style={styles.tipRow}>
              <Ionicons name="checkmark" size={18} color="#00bcd4" style={{ marginRight: 6 }} />
              <Text style={styles.tipText}>Làm cho hình dạng thức ăn trở nên thú vị và hấp dẫn</Text>
            </View>
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
  menuInfoBox: {
    backgroundColor: "#e0f7fa",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
  },
  menuInfoTitle: { color: "#00bcd4", fontWeight: "bold", fontSize: 15 },
  menuInfoText: { color: "#222", fontSize: 13, marginBottom: 2 },
  mealBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 14,
    elevation: 1,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  mealLabelRow: { flexDirection: "row", alignItems: "center" },
  mealLabelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ffe600",
    marginRight: 6,
  },
  mealLabel: {
    color: "#00bcd4",
    fontWeight: "bold",
    fontSize: 15,
    marginRight: 8,
  },
  mealTime: { color: "#00bcd4", fontWeight: "bold", fontSize: 13 },
  mealItemsRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  mealItemCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f5fafd",
    borderRadius: 12,
    paddingVertical: 10,
    marginHorizontal: 4,
    minWidth: 100,
  },
  mealItemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: "#fff",
  },
  mealItemName: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 2,
    textAlign: "center",
    width: 80,
  },
  mealItemKcal: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
  },
  tipsBox: {
    backgroundColor: "#e0f7fa",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    marginBottom: 24,
  },
  tipsHeaderRow: { flexDirection: "row", alignItems: "center" },
  tipsHeader: { color: "#00bcd4", fontWeight: "bold", fontSize: 15, marginLeft: 6 },
  tipRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  tipText: { color: "#0097a7", fontSize: 13, flex: 1 },
  dietTrackingBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00bcd4",
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 18,
    paddingVertical: 8,
    elevation: 2,
  },
  dietTrackingBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default MenuSuggestion;
