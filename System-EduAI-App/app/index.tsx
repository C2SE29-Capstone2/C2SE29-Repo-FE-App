import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import {
  publicApi,
  getAvailableBackendUrls,
  getCurrentBackendUrl,
  setBackendUrl,
  testAllBackendConnections,
} from "./services/api";
import type { Href } from "expo-router";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "./context/AuthContext";

// Thêm dòng này để hoàn thiện AuthSession setup cho Expo
WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID =
  "291396036966-q1o91aase42haegni25h14cna6o570m3.apps.googleusercontent.com";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showBackendSelector, setShowBackendSelector] = useState(false);
  const [currentBackend, setCurrentBackend] = useState(getCurrentBackendUrl());
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Chưa kiểm tra");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const router = useRouter();
  const { setToken } = useAuth();

  // Xử lý đăng nhập Google - Sửa lại để dùng AuthSession.useAuthRequest
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.IdToken,
      redirectUri: AuthSession.makeRedirectUri({
        // Remove useProxy: true - this property doesn't exist
      }),
    },
    {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    }
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleGoogleAuthSuccess(id_token);
    }
  }, [response]);

  const handleGoogleAuthSuccess = async (idToken: string) => {
    try {
      const data = await publicApi.googleAuth(idToken);

      if (!data || !data.success) {
        Alert.alert(
          "Lỗi",
          "Không thể xác thực với Google hoặc API không phản hồi!"
        );
        return;
      }

      if (data.token) {
        await setToken(data.token);
      }

      if (data.role === "student") {
        Alert.alert(
          "Thành công",
          "Đăng nhập Google thành công với vai trò học sinh!"
        );
      } else {
        Alert.alert("Thành công", "Đăng nhập Google thành công!");
      }
    } catch (e) {
      console.error("Google auth success error:", e);
      Alert.alert("Lỗi", "Không thể xử lý xác thực Google!");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await promptAsync();
    } catch (e) {
      console.error("Google login error:", e);
      Alert.alert("Lỗi", "Không thể khởi tạo đăng nhập Google!");
    }
  };

  const handleLogin = async () => {
    if (username === "" || password === "") {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
      return;
    }

    try {
      const result = await publicApi.login(username, password);

      if (!result) {
        Alert.alert(
          "🔴 Backend Server Offline",
          "Không thể kết nối đến bất kỳ backend nào. Có thể:\n\n1️⃣ Spring Boot server chưa được khởi động\n2️⃣ Cổng 8080 bị chặn bởi firewall\n3️⃣ Sai địa chỉ IP mạng\n4️⃣ Backend và frontend không cùng mạng WiFi",
          [
            {
              text: "Hướng dẫn khởi động Backend",
              onPress: () =>
                Alert.alert(
                  "Khởi động Backend Server",
                  "1. Mở terminal/command prompt\n2. cd vào thư mục backend\n3. Chạy: mvn spring-boot:run\n4. Hoặc: ./gradlew bootRun\n5. Đợi server start trên port 8080"
                ),
            },
            {
              text: "Kiểm tra Backend khác",
              onPress: testAllConnections,
            },
            {
              text: "Tiếp tục với Mock Data",
              onPress: () => {
                // Allow demo with mock data
                Alert.alert("Demo Mode", "App sẽ chạy với dữ liệu mẫu để demo");
              },
            },
          ]
        );
        return;
      }

      if (result.success) {
        // Lưu token vào context
        if (result.token) {
          await setToken(result.token);
          console.log("Token saved:", result.token);
        }

        // Điều hướng theo role
        if (result.role === "teacher") {
          router.replace("/teachers/home");
        } else if (result.role === "parent") {
          router.replace("/parents/home_parent");
        } else if (result.role === "student") {
          // Chuyển hướng đến trang học sinh riêng
          router.replace("/students/home_student");
          Alert.alert(
            "Thành công",
            "Đăng nhập thành công với vai trò học sinh!"
          );
        } else {
          Alert.alert("Thành công", "Đăng nhập thành công!");
          // Fallback đến teacher home nếu role không xác định
          router.replace("/teachers/home");
        }
      } else {
        if (result.backendOffline) {
          Alert.alert(
            "🔴 Backend Server Offline",
            result.message +
              "\n\nBạn có muốn:\n1. Khởi động backend server\n2. Hoặc tiếp tục với mock data?",
            [
              {
                text: "Hướng dẫn khởi động",
                onPress: () =>
                  Alert.alert(
                    "Khởi động Backend",
                    "Terminal commands:\n• cd backend-folder\n• mvn spring-boot:run\n• hoặc java -jar app.jar"
                  ),
              },
              {
                text: "Tự động tìm Backend",
                onPress: testAllConnections,
              },
              {
                text: "Demo với Mock Data",
                onPress: () => {
                  // Demo mode - redirect to teacher dashboard with mock data
                  router.replace("/teachers/home");
                },
              },
            ]
          );
        } else if (result.shouldSwitchBackend) {
          // Handle timeout and network errors with auto backend switching
          Alert.alert(
            "Kết nối timeout",
            result.message ||
              "Backend hiện tại không phản hồi. Thử chuyển sang backend khác?",
            [
              {
                text: "Tự động tìm",
                onPress: testAllConnections,
              },
              {
                text: "Chọn thủ công",
                onPress: () => setShowBackendSelector(true),
              },
              { text: "Thử lại", onPress: () => handleLogin() },
            ]
          );
        } else if (result.networkError) {
          Alert.alert(
            "Lỗi mạng",
            result.message || "Có vấn đề với kết nối mạng",
            [
              {
                text: "Chọn Backend",
                onPress: () => setShowBackendSelector(true),
              },
              { text: "OK" },
            ]
          );
        } else {
          Alert.alert(
            "Đăng nhập thất bại",
            result.message ||
              "Tài khoản hoặc mật khẩu không đúng! Vui lòng kiểm tra lại thông tin đăng nhập.",
            [
              { text: "Thử lại" },
              {
                text: "Quên mật khẩu?",
                onPress: () =>
                  Alert.alert(
                    "Thông báo",
                    "Tính năng quên mật khẩu đang được phát triển"
                  ),
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error("Critical Login error:", error);
      Alert.alert("Lỗi", "Đăng nhập thất bại nghiêm trọng!");
    }
  };

  const handleBackendChange = async (url: string) => {
    await setBackendUrl(url);
    setCurrentBackend(url);
    setConnectionStatus("Chưa kiểm tra");
    setShowBackendSelector(false);
    Alert.alert("Thành công", `Đã chuyển sang backend: ${url}`);
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const isConnected = await publicApi.testConnection();
      setConnectionStatus(
        isConnected ? "Kết nối thành công" : "Kết nối thất bại"
      );

      if (!isConnected) {
        Alert.alert(
          "Kết nối thất bại",
          "Không thể kết nối đến backend hiện tại. Bạn có muốn kiểm tra tất cả các backend khác không?",
          [
            { text: "Kiểm tra tất cả", onPress: testAllConnections },
            { text: "Chọn khác", onPress: () => setShowBackendSelector(true) },
            { text: "Hủy" },
          ]
        );
      }
    } catch (error) {
      setConnectionStatus("Lỗi kiểm tra");
    } finally {
      setIsTestingConnection(false);
    }
  };

  const testAllConnections = async () => {
    setIsTestingConnection(true);
    try {
      const results = await testAllBackendConnections();
      const workingUrls = results.filter((r) => r.success);

      if (workingUrls.length > 0) {
        const bestUrl = workingUrls[0].url;
        Alert.alert(
          "Tìm thấy backend hoạt động",
          `Tìm thấy ${workingUrls.length} backend hoạt động. Chuyển sang: ${
            bestUrl.split("//")[1]?.split("/")[0]
          }?`,
          [
            {
              text: "Chuyển",
              onPress: async () => {
                await handleBackendChange(bestUrl);
                // Auto retry login after switching
                setTimeout(() => {
                  handleLogin();
                }, 1000);
              },
            },
            { text: "Chọn khác", onPress: () => setShowBackendSelector(true) },
            { text: "Hủy" },
          ]
        );
      } else {
        Alert.alert(
          "🔴 Tất cả Backend đều Offline",
          "Không tìm thấy backend server nào hoạt động.\n\n📋 Checklist:\n✅ Spring Boot server đã start?\n✅ Port 8080 có mở không?\n✅ Firewall có chặn không?\n✅ Cùng mạng WiFi không?\n\n💡 App có thể chạy demo với mock data",
          [
            {
              text: "Hướng dẫn Backend",
              onPress: () =>
                Alert.alert(
                  "Khởi động Backend Server",
                  "1. Mở terminal\n2. cd backend-project\n3. mvn spring-boot:run\n4. Chờ 'Started Application on port 8080'\n5. Thử login lại"
                ),
            },
            {
              text: "Demo Mode",
              onPress: () => router.replace("/teachers/home"),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kiểm tra các backend");
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Hàm làm mới dữ liệu khi kéo xuống
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Reset form nếu cần
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#E6F0FA" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          {/* Backend Status Bar */}
          <View style={styles.backendStatusBar}>
            <TouchableOpacity
              style={styles.backendInfo}
              onPress={() => setShowBackendSelector(true)}
            >
              <Text style={styles.backendText}>
                Backend: {currentBackend.split("//")[1]?.split("/")[0]}
              </Text>
              <Text style={styles.connectionText}>({connectionStatus})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.testButton}
              onPress={testConnection}
              disabled={isTestingConnection}
            >
              <Text style={styles.testButtonText}>
                {isTestingConnection ? "Đang kiểm tra..." : "Kiểm tra"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Backend Selector Modal */}
          {showBackendSelector && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Chọn Backend Server</Text>
                {getAvailableBackendUrls().map((url, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.backendOption,
                      currentBackend === url && styles.selectedBackend,
                    ]}
                    onPress={() => handleBackendChange(url)}
                  >
                    <Text style={styles.backendOptionText}>
                      {url.split("//")[1]?.split("/")[0]}
                    </Text>
                    {currentBackend === url && (
                      <Text style={styles.currentLabel}>(Hiện tại)</Text>
                    )}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowBackendSelector(false)}
                >
                  <Text style={styles.closeButtonText}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.headerContainer}>
            <Image
              source={require("../assets/images/backgroundLogin.png")}
              style={styles.illustration}
            />
            <Image
              source={require("../assets/images/imageLogin.png")}
              style={styles.logo}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tài khoản"
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>

            {/* Nút Đăng ký */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.registerButtonText}>Đăng ký</Text>
            </TouchableOpacity>

            <Text style={styles.divider}>Cách khác</Text>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
            >
              <Image
                source={{ uri: "https://www.google.com/favicon.ico" }}
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>Đăng nhập bằng Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6F0FA",
    paddingVertical: 30,
  },
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    height: 260,
    justifyContent: "flex-end",
    position: "relative",
  },
  illustration: {
    width: 400,
    height: 500,
    resizeMode: "contain",
  },
  logo: {
    width: 270,
    height: 299,
    resizeMode: "contain",
    position: "absolute",
    top: 60,
    left: "50%",
    transform: [{ translateX: -115 }],
  },
  inputContainer: {
    width: 340,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginTop: -30,
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f8fafc",
  },
  passwordContainer: {
    width: "100%",
    marginBottom: 15,
  },
  forgotPassword: {
    color: "#888",
    fontSize: 14,
    textAlign: "right",
    marginTop: 5,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#00C853",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 5,
    shadowColor: "#00C853",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#00C853",
    borderRadius: 10,
    alignItems: "center",
    padding: 13,
    marginBottom: 10,
    marginTop: 2,
  },
  registerButtonText: {
    color: "#00C853",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    textAlign: "center",
    color: "#888",
    marginVertical: 10,
    fontSize: 15,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    backgroundColor: "#f8fafc",
    marginBottom: 5,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#000",
  },
  backendStatusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  backendInfo: {
    flex: 1,
  },
  backendText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  connectionText: {
    fontSize: 12,
    color: "#666",
  },
  testButton: {
    backgroundColor: "#00C853",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  testButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  backendOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedBackend: {
    backgroundColor: "#e8f5e8",
    borderColor: "#00C853",
  },
  backendOptionText: {
    fontSize: 14,
    color: "#333",
  },
  currentLabel: {
    fontSize: 12,
    color: "#00C853",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#666",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
