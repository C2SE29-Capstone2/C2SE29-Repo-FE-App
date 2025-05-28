import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { publicApi } from "../services/api"; // Fixed import path

type AuthContextType = {
  token: string | null;
  user: any;
  setToken: (token: string | null) => Promise<void>;
  setUser: (user: any) => void;
  login: (username: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from storage on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("userToken");
        const savedRole = await AsyncStorage.getItem("userRole");
        const savedUsername = await AsyncStorage.getItem("username");

        if (savedToken) {
          setTokenState(savedToken);
          setUser({
            username: savedUsername,
            role: savedRole,
            token: savedToken,
          });
        }
      } catch (error) {
        console.error("Error loading token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const setToken = async (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      await AsyncStorage.setItem("userToken", newToken);
    } else {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userRole");
      await AsyncStorage.removeItem("username");
    }
  };

  const login = async (username: string, password: string) => {
    try {
      console.log("AuthContext: Attempting login...");
      const result = await publicApi.login(username, password);

      if (result.success) {
        console.log(
          `AuthContext: Login successful - Role: ${result.role}, Mock: ${
            result.isMockMode || false
          }`
        );

        setUser({
          username: result.username,
          role: result.role,
          token: result.token,
          isMockMode: result.isMockMode || false,
        });
        setTokenState(result.token);

        // Save to storage
        await AsyncStorage.setItem("userToken", result.token);
        await AsyncStorage.setItem("userRole", result.role);
        await AsyncStorage.setItem("username", result.username);

        console.log("AuthContext: User data saved successfully");

        return {
          success: true,
          role: result.role,
          message: result.isMockMode ? "Chế độ demo" : "Đăng nhập thành công",
        };
      } else {
        console.log("AuthContext: Login failed -", result.message);
        return {
          success: false,
          message: result.message || "Đăng nhập thất bại",
        };
      }
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      return {
        success: false,
        message: "Có lỗi xảy ra khi đăng nhập",
      };
    }
  };

  const logout = async () => {
    setTokenState(null);
    setUser(null);
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userRole");
    await AsyncStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setToken,
        setUser,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
