import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Placeholder API function (replace with actual API call)
const fetchTeacher = async () => {
  return {
    fullName: "Nguyễn Thị Hoa",
    phoneNumber: "0901234567",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    email: "hoa.nguyen@example.com",
  };
};

const updateTeacher = async (
  fullName: string,
  phoneNumber: string,
  email: string,
  address: string
) => {
  // Simulated API call
  console.log("Updating teacher:", { fullName, phoneNumber, email, address });
  return true;
};

const UpdateTeacherPage = () => {
  const { teacherId } = useLocalSearchParams(); // Assuming teacherId is passed as a param
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const [teacher, setTeacher] = useState<{
    fullName: string;
    phoneNumber: string;
    address: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const teacherData = await fetchTeacher();
      setTeacher(teacherData);
      setFullName(teacherData.fullName);
      setPhoneNumber(teacherData.phoneNumber);
      setAddress(teacherData.address);
      setEmail(teacherData.email);
    };
    fetchData();
  }, []);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateTeacher(
        fullName.trim(),
        phoneNumber.trim(),
        email.trim(),
        address.trim()
      );
      setTimeout(() => setIsLoading(false), 1000); // Simulate delay
    } catch (error) {
      setIsLoading(false);
    }
  };

  if (!teacher) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={styles.container}>
        <View style={styles.header} />
        <View style={styles.content}>
          <View style={styles.padding}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Thông Tin</Text>
              <View style={styles.inputRow}>
                <Ionicons name="person" size={25} color="#fff" />
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Họ và tên"
                  placeholderTextColor="#fff"
                />
              </View>
              <View style={styles.inputRow}>
                <Ionicons name="call" size={25} color="#fff" />
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Số điện thoại"
                  placeholderTextColor="#fff"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.inputRow}>
                <Ionicons name="home" size={25} color="#fff" />
                <TextInput
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Địa chỉ"
                  placeholderTextColor="#fff"
                />
              </View>
              <View style={styles.inputRow}>
                <Ionicons name="mail" size={25} color="#fff" />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor="#fff"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.updateButtonText}>Cập nhật</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 320,
    width: 400,
    backgroundColor: "#4DB6AC",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  content: {
    position: "absolute",
    top: 120,
    width: width,
    height: height - 120,
    backgroundColor: "#fff",
    borderTopLeftRadius: 400,
    borderTopRightRadius: 40,
    alignItems: "center",
    paddingBottom: 40,
  },
  padding: {
    paddingHorizontal: 10,
    paddingVertical: 30,
    width: "100%",
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: "#fff",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 18,
    marginTop: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    width: "100%",
  },
  input: {
    flex: 1,
    height: 60,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 14,
    backgroundColor: "#4DB6AC",
    color: "#fff",
    marginLeft: -20,
    fontSize: 16,
  },
  updateButton: {
    height: 45,
    width: 180,
    backgroundColor: "#4DB6AC",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#87CEEB",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginTop: 10,
  },
  updateButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default UpdateTeacherPage;
