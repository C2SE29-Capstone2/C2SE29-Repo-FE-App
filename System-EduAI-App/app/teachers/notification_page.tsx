import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";


// Placeholder API function (replace with actual API call)
const fetchNotifications = async () => {
  // Simulated API call
  return [
    {
      id: "1",
      title: "Thông báo nghỉ lễ",
      content: "Trường sẽ nghỉ lễ từ ngày 30/4 đến 3/5. Mong phụ huynh sắp xếp thời gian cho bé.",
      postDay: "28",
      postMonth: "04",
      postYear: "2025",
    },
    {
      id: "2",
      title: "Họp phụ huynh",
      content: "Cuộc họp phụ huynh sẽ diễn ra vào 8h sáng ngày 15/5 tại hội trường.",
      postDay: "10",
      postMonth: "05",
      postYear: "2025",
    },
    {
      id: "3",
      title: "Cập nhật lịch học",
      content: "Lịch học mới sẽ bắt đầu từ ngày 20/5, phụ huynh vui lòng kiểm tra email.",
      postDay: "18",
      postMonth: "05",
      postYear: "2025",
    },
    {
      id: "4",
      title: "Thông báo thi cuối kỳ",
      content: "Kỳ thi cuối kỳ sẽ diễn ra từ ngày 1/6 đến 5/6. Phụ huynh vui lòng nhắc nhở bé ôn tập.",
      postDay: "25",
      postMonth: "05",
      postYear: "2025",
    },
    {
      id: "5",
      title: "Chương trình ngoại khóa",
      content: "Trường tổ chức chương trình ngoại khóa vào ngày 10/6. Phụ huynh đăng ký cho bé tham gia.",
      postDay: "05",
      postMonth: "06",
      postYear: "2025",
    },
  ];
};

type Notification = {
  id: string;
  title: string;
  content: string;
  postDay: string;
  postMonth: string;
  postYear: string;
};

const NotificationPage = ( ) => {

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current; // <-- Thêm dòng này

  useEffect(() => {
    const fetchData = async () => {
      const notificationData = await fetchNotifications();
      setNotifications(notificationData);
    };
    fetchData();

    const timer = setInterval(fetchData, 5000); // Fetch every 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  const renderNotificationItem = ({ item, index }: { item: Notification; index: number }) => {
    return (
    <View style={styles.notificationItem}>
      <View style={styles.notificationHeader}>
        <Ionicons name="newspaper" size={35} color="#4DB6AC" />
        <View style={styles.notificationContent}>
          <View style={styles.notificationTitleRow}>
            <Text style={styles.notificationTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.notificationDate}>
              {item.postDay}/{item.postMonth}/{item.postYear}
            </Text>
          </View>
          <Text style={styles.notificationSubtitle} numberOfLines={2}>
            {item.content}
          </Text>
        </View>
      </View>
      {index < notifications.length - 1 && <View style={styles.divider} />}
    </View>
  );
  };

  return (
    <View style={styles.container}>
    <ImageBackground
      source={require("../../assets/images/backgroundLogin.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(77, 182, 172, 0.8)", "rgba(38, 166, 154, 0.5)"]}
        style={styles.gradientOverlay}
      >
        <View style={styles.header}>
          <TouchableOpacity
              onPress={() => {
                if (router.canGoBack && router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/teachers/home");
                }
              }}
            >
              <Ionicons name="arrow-back" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/teachers/post_page")}>
              <Ionicons name="search" size={25} color="#fff" />
            </TouchableOpacity>
        </View>

        <Animated.View style={[styles.notificationContainer, { opacity: fadeAnim }]}>
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.notificationList}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  </View>
    );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationContainer: {
    marginTop: 20,
    width: 350,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    paddingVertical: 20,
  },
  notificationList: {
    paddingHorizontal: 15,
  },
  notificationItem: {
    marginBottom: 10,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
    marginLeft: 10,
  },
  notificationTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#EF5350",
    flex: 1,
  },
  notificationDate: {
    fontSize: 12,
    fontWeight: "600",
    color: "#00695C",
  },
  notificationSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
});

export default NotificationPage;