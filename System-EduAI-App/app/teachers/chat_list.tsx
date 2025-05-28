import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";

interface Student {
  id: number;
  studentName: string;
  classroomId: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

const ChatListPage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadStudents();
    }
  }, [token]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      // This would be a new API endpoint to get students in teacher's classes
      // For now, using mock data
      const mockStudents: Student[] = [
        {
          id: 1,
          studentName: "Nguyễn Văn An",
          classroomId: 1,
          lastMessage: "Cám ơn cô đã giải thích bài học hôm nay ạ!",
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
        },
        {
          id: 2,
          studentName: "Trần Thị Bảo",
          classroomId: 1,
          lastMessage: "Con có thể hỏi về bài tập không ạ?",
          lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
          unreadCount: 2,
        },
        {
          id: 3,
          studentName: "Lê Minh Châu",
          classroomId: 1,
          lastMessage: "Chào cô!",
          lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
          unreadCount: 1,
        },
      ];
      setStudents(mockStudents);
    } catch (error) {
      console.error("Error loading students:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách học sinh");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentPress = (student: Student) => {
    router.push({
      pathname: "/teachers/message_page",
      params: {
        studentId: student.id,
        classroomId: student.classroomId,
        studentName: student.studentName,
      },
    });
  };

  const renderStudent = ({ item }: { item: Student }) => {
    const lastMessageTime = item.lastMessageTime
      ? new Date(item.lastMessageTime).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <TouchableOpacity
        style={styles.studentItem}
        onPress={() => handleStudentPress(item)}
        activeOpacity={0.7}
      >
        <Image
          source={require("../../assets/images/teacher.png")}
          style={styles.studentAvatar}
        />
        <View style={styles.studentInfo}>
          <View style={styles.studentHeader}>
            <Text style={styles.studentName}>{item.studentName}</Text>
            <Text style={styles.messageTime}>{lastMessageTime}</Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage || "Chưa có tin nhắn"}
          </Text>
        </View>
        {item.unreadCount && item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DB6AC" />
        <Text style={styles.loadingText}>Đang tải danh sách...</Text>
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
        <Text style={styles.headerTitle}>Tin nhắn</Text>
        <View style={{ width: 25 }} />
      </View>

      {/* Student List */}
      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id.toString()}
        style={styles.studentList}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="chat" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Chưa có tin nhắn nào</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    height: 100,
    backgroundColor: "#4DB6AC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  studentList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  studentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  messageTime: {
    fontSize: 12,
    color: "#666",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  unreadBadge: {
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 78,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
});

export default ChatListPage;
