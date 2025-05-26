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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const mockTeacher = {
  fullName: "Nguyễn Thanh Tân",
  phoneNumber: "0761594238",
  avatar: require("../../assets/images/teacher.png"),
};
const mockParent = {
  fullName: "Mẹ Chaien",
  avatar: require("../../assets/images/parent.png"),
};

const mockMessages = [
  {
    id: "1",
    content:
      "Cuối tuần trường có đi An Hòa Farm mà nhà mình có việc mất nên không đi được cô thông cảm nha!",
    hour: 16,
    minute: 4,
    sendUserId: "parent",
  },
  {
    id: "2",
    content: "Dạ vâng chị để em báo với nhà trường ạ!",
    hour: 16,
    minute: 4,
    sendUserId: "teacher",
  },
];

export default function MessagePage() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([
      ...messages,
      {
        id: (messages.length + 1).toString(),
        content: input,
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
        sendUserId: "teacher",
      },
    ]);
    setInput("");
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const buildMessage = (message: any) => {
    const isTeacher = message.sendUserId === "teacher";
    return (
      <View
        key={message.id}
        style={[
          styles.messageRow,
          isTeacher ? styles.messageRowRight : styles.messageRowLeft,
        ]}
      >
        {!isTeacher && (
          <Image source={mockParent.avatar} style={styles.msgAvatar} />
        )}
        <View
          style={[
            styles.bubble,
            isTeacher ? styles.bubbleTeacher : styles.bubbleParent,
          ]}
        >
          <Text
            style={[
              styles.bubbleText,
              isTeacher ? styles.bubbleTextTeacher : styles.bubbleTextParent,
            ]}
          >
            {message.content}
          </Text>
          <Text style={styles.timeText}>
            {`${message.hour.toString().padStart(2, "0")}:${message.minute
              .toString()
              .padStart(2, "0")}`}
          </Text>
        </View>
        {isTeacher && (
          <View style={{ alignItems: "center" }}>
            <Image source={mockTeacher.avatar} style={styles.msgAvatar} />
            <View style={styles.statusDot} />
          </View>
        )}
      </View>
    );
  };

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={mockParent.avatar} style={styles.headerAvatar} />
        <Text style={styles.headerTitle}>Mẹ Chaien</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity>
          <MaterialIcons name="videocam" size={25} color="#fff" />
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
        {messages.map((msg) => buildMessage(msg))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.inputIcon}>
          <MaterialIcons name="emoji-emotions" size={28} color="#2196F3" />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Viết tin nhắn..."
          placeholderTextColor="#94a3b8"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.inputIcon}>
          <MaterialIcons name="mic" size={24} color="#14b8a6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.inputIcon} onPress={handleSend}>
          <MaterialIcons name="send" size={28} color="#2196F3" />
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
    backgroundColor: "transparent", // light blue
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#38bdf8", // blue-400
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
  bubbleParent: {
    backgroundColor: "#fff",
    marginLeft: 0,
    marginRight: 8,
  },
  bubbleTeacher: {
    backgroundColor: "#2196F3",
    marginLeft: 8,
    marginRight: 0,
  },
  bubbleText: {
    fontSize: 15,
    marginBottom: 4,
  },
  bubbleTextParent: {
    color: "#222",
  },
  bubbleTextTeacher: {
    color: "#fff",
  },
  timeText: {
    fontSize: 12,
    color: "#b0b0b0",
    alignSelf: "flex-end",
    marginTop: -2,
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
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 18,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    color: "#222",
    paddingHorizontal: 12,
    paddingVertical: 20,
    borderRadius: 24,
    fontSize: 20,
    marginRight: 4,
  },
  inputIcon: {
    marginLeft: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  }, 
});
