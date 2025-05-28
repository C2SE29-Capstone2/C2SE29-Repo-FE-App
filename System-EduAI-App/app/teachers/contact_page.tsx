import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Mock Teacher model
const Teacher = {
  phoneNumber: "0962492787",
  email: "teacher@example.com",
};

// Mock TeacherController
class TeacherController {
  isLoading: { value: boolean };
  teacher: { value: typeof Teacher };

  constructor() {
    this.isLoading = { value: false };
    this.teacher = { value: Teacher };
  }

  async fetchTeacher() {
    this.isLoading.value = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isLoading.value = false;
        this.teacher.value = Teacher;
        resolve(this.teacher.value);
      }, 1000);
    });
  }
}

// Simple useController mock for demo (replace with your actual state management)
function useController<T>(factory: () => T): T {
  const ref = React.useRef<T>();
  if (!ref.current) {
    ref.current = factory();
  }
  return ref.current;
}

const ContactPage = () => {
  const router = useRouter();
  const controller = useController(() => new TeacherController());
  const [isLoading, setIsLoading] = React.useState(controller.isLoading.value);
  const [teacher, setTeacher] = React.useState(controller.teacher.value);

  useEffect(() => {
    const loadData = async () => {
      await controller.fetchTeacher();
      setIsLoading(controller.isLoading.value);
      setTeacher(controller.teacher.value);
    };
    loadData();
  }, []);

  const handleUrlPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Cannot open URL:", url);
      }
    } catch (error) {
      console.log("Error opening URL:", error);
    }
  };

  const contactLinks = [
    {
      icon: "house",
      text: "71 An Phú, Thanh Khê, Đà Nẵng",
      url: "https://maps.google.com/?q=71+An+Phú,+Thanh+Khê,+Đà+Nẵng",
    },
    {
      icon: "facebook",
      text: "https://www.facebook.com/fishman793",
      url: "https://www.facebook.com/fishman793",
    },
    {
      icon: "phone",
      text: "Hotline nhà trường: 0962492787",
      url: "tel:0962492787",
    },
    {
      icon: "phone-in-talk",
      text: `Hotline cô giáo: ${teacher.phoneNumber}`,
      url: `tel:${teacher.phoneNumber}`,
    },
    {
      icon: "email",
      text: `Email cô giáo: ${teacher.email}`,
      url: `mailto:${teacher.email}`,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4DB6AC" />
          <Text>Đang tải thông tin...</Text>
        </View>
      ) : teacher ? (
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back" size={28} color="#ffffff" />
              <Text style={styles.backButtonText}>Quay lại</Text>
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <Text style={styles.headerText}>Trường Mầm Non</Text>
              <Text style={[styles.headerText, styles.headerTextOffset1]}>
                Edu
              </Text>
              <Text style={[styles.headerText, styles.headerTextOffset2]}>
                Monitor
              </Text>
            </View>
          </View>

          {/* Contact Card */}
          <View style={styles.contactCard}>
            {/* Address Section */}
            <View style={styles.addressSection}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="location-on" size={24} color="#4DB6AC" />
                <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
              </View>

              {contactLinks.map((link, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.contactItem}
                  onPress={() => handleUrlPress(link.url)}
                >
                  <MaterialIcons
                    name={link.icon as any}
                    size={20}
                    color="#4DB6AC"
                    style={styles.contactIcon}
                  />
                  <Text style={styles.contactText}>{link.text}</Text>
                  <MaterialIcons name="open-in-new" size={16} color="#666" />
                </TouchableOpacity>
              ))}
            </View>

            {/* School Info Section */}
            <View style={styles.schoolInfoSection}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="school" size={24} color="#4DB6AC" />
                <Text style={styles.sectionTitle}>Thông tin trường</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Tên trường:</Text>
                <Text style={styles.infoValue}>Trường Mầm Non EduMonitor</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Thời gian hoạt động:</Text>
                <Text style={styles.infoValue}>
                  7:00 - 17:00 (Thứ 2 - Thứ 6)
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Độ tuổi:</Text>
                <Text style={styles.infoValue}>18 tháng - 5 tuổi</Text>
              </View>
            </View>

            {/* Emergency Contacts */}
            <View style={styles.emergencySection}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="emergency" size={24} color="#f44336" />
                <Text style={[styles.sectionTitle, { color: "#f44336" }]}>
                  Liên hệ khẩn cấp
                </Text>
              </View>

              <TouchableOpacity
                style={styles.emergencyButton}
                onPress={() => handleUrlPress("tel:113")}
              >
                <MaterialIcons name="local-police" size={20} color="#fff" />
                <Text style={styles.emergencyButtonText}>Công an: 113</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.emergencyButton}
                onPress={() => handleUrlPress("tel:115")}
              >
                <MaterialIcons name="local-hospital" size={20} color="#fff" />
                <Text style={styles.emergencyButtonText}>Y tế: 115</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#f44336" />
          <Text style={styles.errorText}>Không thể tải thông tin liên hệ</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: "#4DB6AC",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  headerContent: {
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerTextOffset1: {
    marginLeft: 20,
  },
  headerTextOffset2: {
    marginLeft: 40,
  },
  contactCard: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  addressSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    marginBottom: 8,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  schoolInfoSection: {
    marginBottom: 25,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 20,
  },
  infoItem: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    width: 120,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  emergencySection: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 20,
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  emergencyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#f44336",
    textAlign: "center",
    marginVertical: 10,
  },
  retryButton: {
    backgroundColor: "#4DB6AC",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ContactPage;
