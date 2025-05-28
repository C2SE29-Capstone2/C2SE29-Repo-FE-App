import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

interface MenuDrawerProps {
  visible: boolean;
  onClose: () => void;
  userRole: "teacher" | "parent" | "student";
  userName?: string;
}

export default function MenuDrawer({
  visible,
  onClose,
  userRole,
  userName,
}: MenuDrawerProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleNavigation = (path: string) => {
    onClose();
    router.push(path as any);
  };

  const handleLogout = async () => {
    onClose();
    await logout();
    router.replace("/");
  };

  const getMenuItems = () => {
    const commonItems = [
      {
        icon: "home",
        label: "Trang chủ",
        path:
          userRole === "teacher"
            ? "/teachers/home"
            : userRole === "parent"
            ? "/parents/home_parent"
            : "/students/home_student",
      },
      {
        icon: "person",
        label: "Thông tin cá nhân",
        path:
          userRole === "teacher"
            ? "/teachers/account_page"
            : "/parents/student_account_page",
      },
      {
        icon: "message",
        label: "Tin nhắn",
        path:
          userRole === "teacher"
            ? "/teachers/message_page"
            : "/parents/message_parent",
      },
      { icon: "photo", label: "Album ảnh", path: "/teachers/album" },
      {
        icon: "notifications",
        label: "Thông báo",
        path: "/teachers/notification_page",
      },
    ];

    if (userRole === "teacher") {
      commonItems.push(
        {
          icon: "add-alert",
          label: "Dinh dưỡng & Sức khỏe",
          path: "/teachers/medicine_page",
        },
        { icon: "article", label: "Nhận xét", path: "/teachers/comment" },
        {
          icon: "edit",
          label: "Cập nhật thông tin",
          path: "/teachers/update_teacher_page",
        }
      );
    }

    if (userRole === "parent" || userRole === "student") {
      commonItems.push({
        icon: "health-and-safety",
        label: "Theo dõi sức khỏe",
        path: "/teachers/medicine_page",
      });
    }

    commonItems.push(
      { icon: "help", label: "Liên hệ hỗ trợ", path: "/teachers/contact_page" },
      { icon: "logout", label: "Đăng xuất", path: "logout" }
    );

    return commonItems;
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case "teacher":
        return "Giáo viên";
      case "parent":
        return "Phụ huynh";
      case "student":
        return "Học sinh";
      default:
        return "Người dùng";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.drawer}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/teacher.png")}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userName || "Người dùng"}</Text>
              <Text style={styles.userRole}>{getRoleDisplayName()}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.menuContainer}>
            {getMenuItems().map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  if (item.path === "logout") {
                    handleLogout();
                  } else {
                    handleNavigation(item.path);
                  }
                }}
              >
                <MaterialIcons
                  name={item.icon as any}
                  size={24}
                  color={item.path === "logout" ? "#f44336" : "#4DB6AC"}
                />
                <Text
                  style={[
                    styles.menuText,
                    item.path === "logout" && styles.logoutText,
                  ]}
                >
                  {item.label}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>EduAI System v1.0</Text>
            <Text style={styles.footerSubtext}>Hệ thống quản lý mầm non</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawer: {
    width: 280,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 16,
  },
  header: {
    backgroundColor: "#4DB6AC",
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  userRole: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: "#333",
  },
  logoutText: {
    color: "#f44336",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4DB6AC",
  },
  footerSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});
