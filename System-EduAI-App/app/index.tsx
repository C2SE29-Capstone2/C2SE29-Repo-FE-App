import { Text, View, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { loginApi } from "./services/api";
import type { Href } from "expo-router";

export default function LoginScreen() {

  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const router = useRouter();


  const handleLogin = async () => {
    if (username === "" || password === "") {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
      return;
    }

    try {
      const result = await loginApi(username, password);
      if (result.success) {
        if (result.role === "teacher") {
          router.replace("/teachers/home" as Href<"/teachers/home">);
        } else if (result.role === "parent") {
          router.replace("/parents/home_parent" as Href<"/parents/home_parent">);
        } else if (result.role === "student") {
          router.replace("/students/home_student" as Href<"/students/home_student">);
        }
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đăng nhập thất bại!");
    }
  };

  return (
    <View style={styles.container}>
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
          <TouchableOpacity >
            <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>

        <Text style={styles.divider}>Cách khác</Text>

        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={{ uri: "https://www.google.com/favicon.ico" }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Đăng nhập bằng Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F0FA",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  inputContainer: {
    width: 310,
    height: 351,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginTop: -200,
    top: -60,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    marginBottom: 15,
  },
  forgotPassword: {
    color: "#888",
    fontSize: 14,
    textAlign: "right",
    marginTop: 5,
  },
  loginButton: {
    backgroundColor: "#00C853",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    textAlign: "center",
    color: "#888",
    marginVertical: 10,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 10,
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
});