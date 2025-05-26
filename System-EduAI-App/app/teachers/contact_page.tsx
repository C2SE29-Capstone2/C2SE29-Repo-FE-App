import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

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
  const controller = useController(() => new TeacherController());
  const [isLoading, setIsLoading] = React.useState(controller.isLoading.value);
  const [teacher, setTeacher] = React.useState(controller.teacher.value);
  const navigation = useNavigation();

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

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#009688" />
        </View>
      ) : teacher ? (
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/teachers/home")}
            >
              <MaterialIcons name="arrow-back" size={28} color="#fffff" />
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
              <Text style={styles.sectionTitle}>Địa Chỉ :</Text>
              <View style={styles.addressRow}>
                <Text style={styles.addressLabel}>Cơ Sở 1: </Text>
                <Text style={styles.addressText}>
                  71 An Phú, Thanh Khê, Đà Nẵng
                </Text>
              </View>
              <View style={styles.addressRow}>
                <Text style={styles.addressLabel}>Cơ Sở 2: </Text>
                <Text style={styles.addressText}>
                  17 Trần Phú, Thanh Khê, Đà Nẵng
                </Text>
              </View>
            </View>

            {/* Contact Links */}
            {[
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
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactButton}
                onPress={() => handleUrlPress(item.url)}
              >
                <View style={styles.contactButtonContent}>
                  <MaterialIcons name={item.icon} size={30} color="#009688" />
                  <Text
                    style={[
                      styles.contactButtonText,
                      item.icon === "email" && styles.underline,
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không có data</Text>
        </View>
      )}
    </ScrollView>
  );
};

const { width, height } = Dimensions.get("window");

export { TeacherController, Teacher };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: height,
  },
  content: {
    width: width,
    height: height,
  },
  header: {
    width: width,
    height: 380,
    backgroundColor: "#009688", // teal
    borderBottomRightRadius: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 10,
  },
  headerContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  headerText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "white",
    paddingLeft: 10,
  },
  headerTextOffset1: {
    fontSize: 45,
    paddingLeft: 50,
    marginTop: 10,
  },
  headerTextOffset2: {
    fontSize: 45,
    paddingLeft: 120,
  },
  contactCard: {
    width: width,
    // height: 500, // Xóa dòng này để chiều cao tự động theo nội dung
    backgroundColor: "white",
    borderTopLeftRadius: 120,
    borderBottomRightRadius: 120,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 7,
    marginTop: -100, // Overlap with header
    paddingTop: 20,
    paddingLeft: 0, // Để căn giữa
    alignItems: "center",
  },
  addressSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  addressRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "800",
  },
  addressText: {
    fontSize: 16,
  },
  contactButton: {
    width: width - 60, // Thu nhỏ lại cho cân đối
    height: 48,
    backgroundColor: "white",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 2,
    marginHorizontal: 0,
    marginBottom: 16,
    alignItems: "center", // Căn giữa theo chiều ngang
    justifyContent: "center", // Căn giữa theo chiều dọc
    alignSelf: "center",
  },
  contactButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 5,
  },
  underline: {
    textDecorationLine: "underline",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: height,
  },
  errorText: {
    fontSize: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginLeft: 20,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default ContactPage;
