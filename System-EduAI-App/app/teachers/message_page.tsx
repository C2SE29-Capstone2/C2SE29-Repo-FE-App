import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";

interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  classroomId: number;
  isTeacherSender: boolean;
  senderName?: string;
}

export default function TeacherMessagePage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { token } = useAuth();

  // Get parameters from route
  const parentId = params.parentId ? parseInt(params.parentId as string) : 1;
  const classroomId = params.classroomId
    ? parseInt(params.classroomId as string)
    : 1;
  const parentName = (params.parentName as string) || "Phụ huynh";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (token) {
      loadChatHistory();
      // Set up more frequent polling for real-time updates
      const interval = setInterval(() => {
        loadChatHistory(false); // Silent refresh
      }, 2000); // Check every 2 seconds for new messages
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadChatHistory = async (showRefreshing = false) => {
    if (!token) return;

    try {
      if (showRefreshing) setRefreshing(true);
      else if (messages.length === 0) setLoading(true);

      console.log("Loading chat history for teacher with:", {
        classroomId,
        parentId,
        isTeacher: true,
      });

      const history = await authApi.getChatHistory(
        token,
        classroomId,
        parentId,
        true // isTeacher = true
      );

      console.log("Received chat history:", history);

      // Check if messages have actually changed before updating state
      const currentMessageIds = messages.map((m) => m.id).sort();
      const newMessageIds = (history || []).map((m) => m.id).sort();

      if (JSON.stringify(currentMessageIds) !== JSON.stringify(newMessageIds)) {
        setMessages(history || []);
        // Auto scroll to bottom when new messages arrive
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      if (showRefreshing) {
        Alert.alert("Lỗi", "Không thể tải tin nhắn mới");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSend = async () => {
    if (input.trim() === "" || !token || sending) return;

    const messageContent = input.trim();
    setInput("");
    setSending(true);

    try {
      console.log("Sending message as teacher:", {
        classroomId,
        parentId,
        isTeacher: true,
        content: messageContent,
      });

      const sentMessage = await authApi.sendMessage(
        token,
        classroomId,
        parentId,
        true, // isTeacher = true
        messageContent
      );

      console.log("Sent message result:", sentMessage);

      if (sentMessage) {
        // Add message immediately to UI for instant feedback
        setMessages((prev) => [...prev, sentMessage]);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Force refresh chat history after a short delay to sync with server
        setTimeout(() => {
          loadChatHistory(false);
        }, 1000);
      } else {
        Alert.alert("Lỗi", "Không thể gửi tin nhắn");
        setInput(messageContent); // Restore input
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi tin nhắn");
      setInput(messageContent); // Restore input
    } finally {
      setSending(false);
    }
  };

  const buildMessage = (message: ChatMessage) => {
    const isCurrentUserMessage = message.isTeacherSender; // Current user is teacher
    const messageTime = new Date(message.timestamp);

    return (
      <View
        key={`message-${message.id}-${message.timestamp}`}
        style={[
          styles.messageRow,
          isCurrentUserMessage ? styles.messageRowRight : styles.messageRowLeft,
        ]}
      >
        {!isCurrentUserMessage && (
          <Image
            source={require("../../assets/images/teacher.png")}
            style={styles.msgAvatar}
          />
        )}
        <View
          style={[
            styles.bubble,
            isCurrentUserMessage ? styles.bubbleTeacher : styles.bubbleParent,
          ]}
        >
          <Text
            style={[
              styles.bubbleText,
              isCurrentUserMessage
                ? styles.bubbleTextTeacher
                : styles.bubbleTextParent,
            ]}
          >
            {message.content}
          </Text>
          <Text style={styles.timeText}>
            {messageTime.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        {isCurrentUserMessage && (
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../../assets/images/teacher.png")}
              style={styles.msgAvatar}
            />
            <View style={styles.statusDot} />
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DB6AC" />
        <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ImageBackground
        source={require("../../assets/images/imageBackground.png")}
        style={styles.background}
        resizeMode="cover"
        blurRadius={8}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back-ios" size={24} color="#fff" />
            </TouchableOpacity>
            <Image
              source={require("../../assets/images/teacher.png")}
              style={styles.headerAvatar}
            />
            <Text style={styles.headerTitle}>{parentName}</Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => loadChatHistory(true)}>
              <MaterialIcons
                name="refresh"
                size={25}
                color="#fff"
                style={{ opacity: refreshing ? 0.5 : 1 }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialIcons
                name="phone-in-talk"
                size={25}
                color="#fff"
                style={{ marginLeft: 20 }}
              />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView
            style={styles.messages}
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
            keyboardShouldPersistTaps="handled"
          >
            {messages.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                </Text>
              </View>
            ) : (
              messages.map((msg) => buildMessage(msg))
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.inputIcon}>
              <MaterialIcons name="emoji-emotions" size={28} color="#2196F3" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Viết tin nhắn cho phụ huynh..."
              placeholderTextColor="#94a3b8"
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={styles.inputIcon}>
              <MaterialIcons name="mic" size={24} color="#14b8a6" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.inputIcon, sending && styles.disabledButton]}
              onPress={handleSend}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator size={20} color="#2196F3" />
              ) : (
                <MaterialIcons name="send" size={28} color="#2196F3" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4DB6AC",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    height: 115,
  },
  headerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 10,
    borderWidth: 3,
    borderColor: "#fff",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
  },
  messages: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  messageRowLeft: {
    justifyContent: "flex-start",
  },
  messageRowRight: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  msgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 6,
    marginLeft: 6,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  bubble: {
    maxWidth: "70%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: "center",
  },
  bubbleTeacher: {
    backgroundColor: "#4DB6AC",
    marginLeft: 8,
    marginRight: 0,
  },
  bubbleTextTeacher: {
    color: "#fff",
  },
  bubbleParent: {
    backgroundColor: "#fff",
    marginLeft: 0,
    marginRight: 8,
  },
  bubbleTextParent: {
    color: "#222",
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 12,
    color: "#b0b0b0",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  statusDot: {
    width: 10,
    height: 10,
    backgroundColor: "#22C55E",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
    position: "absolute",
    bottom: 2,
    right: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 13,
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    color: "#222",
    paddingHorizontal: 12,
    paddingVertical: 20,
    borderRadius: 24,
    fontSize: 16,
    marginRight: 4,
    maxHeight: 100,
  },
  inputIcon: {
    marginLeft: 1,
    padding: 4,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
