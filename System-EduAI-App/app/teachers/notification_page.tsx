import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const fetchNotifications = async () => {
  return [
    {
      id: "1",
      title: "Thông báo nghỉ lễ",
      content:
        "Trường sẽ nghỉ lễ từ ngày 30/4 đến 3/5. Mong phụ huynh sắp xếp thời gian cho bé.",
      postDay: "28",
      postMonth: "04",
      postYear: "2025",
    },
    {
      id: "2",
      title: "Họp phụ huynh",
      content:
        "Cuộc họp phụ huynh sẽ diễn ra vào 8h sáng ngày 15/5 tại hội trường.",
      postDay: "10",
      postMonth: "05",
      postYear: "2025",
    },
    {
      id: "3",
      title: "Cập nhật lịch học",
      content:
        "Lịch học mới sẽ bắt đầu từ ngày 20/5, phụ huynh vui lòng kiểm tra email.",
      postDay: "18",
      postMonth: "05",
      postYear: "2025",
    },
    {
      id: "4",
      title: "Thông báo thi cuối kỳ",
      content:
        "Kỳ thi cuối kỳ sẽ diễn ra từ ngày 1/6 đến 5/6. Phụ huynh vui lòng nhắc nhở bé ôn tập.",
      postDay: "25",
      postMonth: "05",
      postYear: "2025",
    },
    {
      id: "5",
      title: "Chương trình ngoại khóa",
      content:
        "Trường tổ chức chương trình ngoại khóa vào ngày 10/6. Phụ huynh đăng ký cho bé tham gia.",
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

const NotificationPage = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Error loading notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={styles.notificationCard}>
      <View style={styles.dateContainer}>
        <Text style={styles.day}>{item.postDay}</Text>
        <Text style={styles.month}>{item.postMonth}</Text>
        <Text style={styles.year}>{item.postYear}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content} numberOfLines={3}>
          {item.content}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông Báo</Text>
        <View style={{ width: 25 }} />
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4DB6AC",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateContainer: {
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#4DB6AC",
    borderRadius: 8,
    padding: 12,
    minWidth: 60,
  },
  day: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  month: {
    fontSize: 14,
    color: "#fff",
    marginTop: 2,
  },
  year: {
    fontSize: 12,
    color: "#fff",
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});

export default NotificationPage;
