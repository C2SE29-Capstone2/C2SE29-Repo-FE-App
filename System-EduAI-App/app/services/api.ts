import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  HealthInfoDTO,
  GrowthRecordDTO,
  CreateHealthReminderDTO,
  AnnouncementDTO,
  GrowthChartDataPoint,
} from "../types/health";

// Multiple backend URL options for different environments
const BACKEND_URLS = [
  "http://192.168.3.6:8080/api/v1",
  "http://192.168.1.71:8080/api/v1", 
  "http://10.0.2.2:8080/api/v1",
  "http://localhost:8080/api/v1",
  "http://172.26.2.113:8080/api/v1",
];

const STORAGE_KEY_BACKEND_URL = "selected_backend_url";

// Get current backend URL from storage or use first as default
let API_BASE_URL = BACKEND_URLS[0];

// Load saved backend URL on startup
AsyncStorage.getItem(STORAGE_KEY_BACKEND_URL).then((savedUrl) => {
  if (savedUrl && BACKEND_URLS.includes(savedUrl)) {
    API_BASE_URL = savedUrl;
    console.log("Loaded saved backend URL:", API_BASE_URL);
  }
});

// Function to change backend URL
export const setBackendUrl = async (url: string) => {
  if (BACKEND_URLS.includes(url)) {
    API_BASE_URL = url;
    await AsyncStorage.setItem(STORAGE_KEY_BACKEND_URL, url);
    console.log("Backend URL changed to:", API_BASE_URL);
    return true;
  }
  return false;
};

// Function to get all available backend URLs
export const getAvailableBackendUrls = () => BACKEND_URLS;

// Function to get current backend URL
export const getCurrentBackendUrl = () => API_BASE_URL;

// Add mock mode flag with better initialization
let MOCK_MODE = false;
let CONNECTION_TESTED = false;

// Improved error handling with automatic backend switching
const handleApiError = (error: any, message: string) => {
  console.error(`API Error - ${message}:`, error);

  if (error.message === "Network request failed" || error.name === "AbortError" || error.name === "TypeError") {
    console.error("🔴 BACKEND CONNECTIVITY ISSUE DETECTED:");
    console.error(`1. Current backend URL: ${API_BASE_URL}`);
    console.error("2. Backend server may be offline");
    console.error("3. Will try alternative URLs or enable mock mode");
    
    // Try next backend URL or enable mock mode
    tryNextBackendUrl();
  }

  return null;
};

// Function to try next available backend URL
const tryNextBackendUrl = async () => {
  const currentIndex = BACKEND_URLS.indexOf(API_BASE_URL);
  const nextIndex = (currentIndex + 1) % BACKEND_URLS.length;
  
  if (nextIndex === 0) {
    // We've tried all URLs, enable mock mode
    console.log("🔄 All backend URLs failed - enabling mock mode");
    MOCK_MODE = true;
    return false;
  }
  
  API_BASE_URL = BACKEND_URLS[nextIndex];
  console.log(`🔄 Switching to backend URL: ${API_BASE_URL}`);
  await AsyncStorage.setItem(STORAGE_KEY_BACKEND_URL, API_BASE_URL);
  return true;
};

// Enhanced connection test with multiple retries
export const testAllBackendConnections = async () => {
  const results = [];
  console.log("🔍 Testing all backend connections...");

  for (const url of BACKEND_URLS) {
    try {
      console.log(`Testing: ${url}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Increased timeout

      const res = await fetch(`${url}/public/login`, {
        method: "OPTIONS",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const isSuccess = res.status === 200 || res.status === 404 || res.status === 405;
      results.push({
        url,
        status: res.status,
        success: isSuccess,
        responseTime: Date.now(),
      });

      console.log(`${url}: ${isSuccess ? "✅ SUCCESS" : "❌ FAILED"} (${res.status})`);
      
      // If this URL works, use it
      if (isSuccess && API_BASE_URL !== url) {
        API_BASE_URL = url;
        await AsyncStorage.setItem(STORAGE_KEY_BACKEND_URL, url);
        console.log(`🎯 Using working backend: ${url}`);
        return results;
      }
    } catch (error) {
      console.log(`${url}: ❌ FAILED (${error.message})`);
      results.push({
        url,
        status: "error",
        success: false,
        error: error.message,
      });
    }
  }

  // If all failed, enable mock mode
  if (results.every((r) => !r.success)) {
    console.log("🔄 All backends failed - enabling mock mode");
    MOCK_MODE = true;
  }

  CONNECTION_TESTED = true;
  return results;
};

// Các API công khai không cần token
export const publicApi = {
  async login(username: string, password: string) {
    // Test connections first if not done
    if (!CONNECTION_TESTED) {
      await testAllBackendConnections();
    }
    
    try {
      console.log(`🔑 Attempting login for ${username} to ${API_BASE_URL}/public/login`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased timeout
      
      const res = await fetch(`${API_BASE_URL}/public/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Fix: Check for authentication errors in 202 responses
      if (res.status === 202 || !res.ok) {
        console.error(`❌ Login failed with status: ${res.status}`);
        
        // Parse error response for detailed error message
        try {
          const errorData = await res.json();
          if (errorData.message && errorData.message.includes("Not authenticated")) {
            return { success: false, message: "Tên đăng nhập hoặc mật khẩu không đúng" };
          }
          if (errorData.trace && errorData.trace.includes("BadCredentialsException")) {
            return { success: false, message: "Thông tin đăng nhập không chính xác" };
          }
        } catch (parseError) {
          console.warn("Could not parse error response:", parseError);
        }
        
        if (res.status >= 500 || res.status === 0) {
          // Server error, try next URL
          const switched = await tryNextBackendUrl();
          if (switched) {
            // Retry with new URL
            return await this.login(username, password);
          }
        }
        
        if (res.status === 401 || res.status === 202) {
          return { success: false, message: "Tên đăng nhập hoặc mật khẩu không đúng" };
        }
        
        return { success: false, message: "Đăng nhập thất bại" };
      }

      const data = await res.json();
      console.log("✅ Login response:", data);

      // Backend trả về JwtResponse với token, id, username, roles
      if (data && data.roles && data.token) {
        let role: string | undefined;
        if (data.roles.includes("ROLE_TEACHER")) role = "teacher";
        else if (data.roles.includes("ROLE_PARENT")) role = "parent";
        else if (data.roles.includes("ROLE_STUDENT")) role = "student";
        
        console.log(`✅ Login successful - Role: ${role}, Token: ${data.token.substring(0, 20)}...`);
        return { success: true, role, token: data.token, username: data.username };
      }
      return { success: false, message: "Phản hồi từ server không hợp lệ" };
    } catch (error) {
      console.error("🔴 Login network error details:", {
        message: error.message,
        name: error.name,
        currentUrl: API_BASE_URL,
        availableUrls: BACKEND_URLS
      });
      
      // Try next backend URL
      const switched = await tryNextBackendUrl();
      if (switched && !MOCK_MODE) {
        console.log("🔄 Retrying login with new backend URL");
        return await this.login(username, password);
      }
      
      // Enable mock mode for demo
      MOCK_MODE = true;
      console.log("💡 Auto-enabling mock mode due to network error");
      
      // Return mock login success for demo
      if (username && password) {
        const mockRole = username.includes('teacher') ? 'teacher' : 
                        username.includes('parent') ? 'parent' : 'teacher'; // Default to teacher
        
        return {
          success: true,
          role: mockRole,
          token: "mock_token_" + Date.now(),
          username: username,
          isMockMode: true,
          message: "Chế độ demo - Backend offline"
        };
      }
      
      return { 
        success: false, 
        message: "Không thể kết nối đến server. Vui lòng thử lại sau.",
        networkError: true
      };
    }
  },

  async register(signupData: {
    name: string;
    username: string;
    gender: boolean;
    dateOfBirth: string; // "YYYY-MM-DD" format for LocalDate
    address: string;
    phone: string;
    email: string;
    password: string;
  }) {
    try {
      console.log(`Attempting registration to ${API_BASE_URL}/public/signup`);
      const res = await fetch(`${API_BASE_URL}/public/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      if (!res.ok) {
        console.error(`Registration failed with status: ${res.status}`);
        return { success: false, message: "Không thể kết nối máy chủ!" };
      }

      const data = await res.json();
      console.log("Registration response:", data);

      // Backend trả về MessageResponse
      if (data && data.message) {
        const isSuccess = data.message.includes("successful");
        return {
          success: isSuccess,
          message: isSuccess ? "Đăng ký thành công!" : data.message,
        };
      }
      return { success: false, message: "Đăng ký thất bại!" };
    } catch (error) {
      return handleApiError(error, "Registration failed");
    }
  },

  async googleAuth(token: string) {
    try {
      console.log(`Attempting Google auth to ${API_BASE_URL}/public/oauth/google`);
      const res = await fetch(`${API_BASE_URL}/public/oauth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        console.error(`Google auth failed with status: ${res.status}`);
        return null;
      }

      const data = await res.json();
      console.log("Google auth response:", data);

      // Backend trả về JwtResponse với token
      if (data && data.token) {
        return {
          success: true,
          token: data.token,
          role: "student", // Google auth tạo ROLE_STUDENT
          username: data.username || data.email,
        };
      }
      return null;
    } catch (error) {
      return handleApiError(error, "Google auth failed");
    }
  },

  async forgotPassword(username: string) {
    try {
      console.log(`Attempting forgot password for ${username}`);
      const res = await fetch(`${API_BASE_URL}/public/forgot-password/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        // Backend trả về error map
        return { success: false, errors: data };
      }

      // Backend trả về success message
      return { success: true, message: data.message };
    } catch (error) {
      return handleApiError(error, "Forgot password failed");
    }
  },

  async resetPassword(username: string, otp: string, newPassword: string) {
    try {
      console.log(`Attempting reset password for ${username}`);
      const res = await fetch(`${API_BASE_URL}/public/reset-password/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Backend trả về error map
        return { success: false, errors: data };
      }

      // Backend trả về success message
      return { success: true, message: data.message };
    } catch (error) {
      return handleApiError(error, "Reset password failed");
    }
  },

  async testConnection() {
    try {
      console.log("🔍 Testing connection to:", API_BASE_URL);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased timeout

      const res = await fetch(`${API_BASE_URL}/public/login`, {
        method: "OPTIONS",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("✅ Connection test result:", res.status);

      const isSuccess = res.status === 200 || res.status === 404 || res.status === 405;
      if (!isSuccess) {
        console.warn("⚠️ Connection failed, trying alternative backends");
        await tryNextBackendUrl();
      }
      CONNECTION_TESTED = true;
      return isSuccess;
    } catch (error) {
      console.error("❌ Connection test failed for:", API_BASE_URL, error.message);
      await tryNextBackendUrl();
      CONNECTION_TESTED = true;
      return false;
    }
  },
};

// Enhanced authApi with better error handling
const authApiObject = {
  // Teacher APIs with improved mock data
  async getTeacherDetail(token: string) {
    if (MOCK_MODE) {
      console.log("📱 Using enhanced mock teacher data (backend offline)");
      return {
        teacherName: "Nguyễn Thị Hoa (Demo)",
        teacherPhone: "0901234567",
        teacherAddress: "123 Đường Giáo Dục, Quận 1, TP.HCM",
        accountEmail: "hoa.teacher@school.edu.vn",
        dateOfBirth: "1990-05-15",
        teacherGender: false,
        qualifications: "Thạc sĩ Giáo dục Mầm non - ĐH Sư Phạm TP.HCM",
        username: "teacher_hoa",
        experience: "8 năm kinh nghiệm",
        specialization: "Phương pháp Montessori"
      };
    }

    try {
      console.log(`Fetching teacher detail from ${API_BASE_URL}/teacher/detail`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const res = await fetch(`${API_BASE_URL}/teacher/detail`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        console.error(`getTeacherDetail failed with status: ${res.status}`);
        
        if (res.status >= 500) {
          // Server error, try fallback
          await tryNextBackendUrl();
          if (!MOCK_MODE) {
            return await this.getTeacherDetail(token);
          }
        }
        
        if (res.status === 401) {
          console.warn("Token expired, user needs to re-login");
          return null;
        }
        
        return null;
      }

      const data = await res.json();
      console.log("✅ Get teacher detail response:", data);

      // Ensure all string fields have fallback values
      return {
        ...data,
        teacherName: data.teacherName ?? "",
        teacherPhone: data.teacherPhone ?? "",
        teacherAddress: data.teacherAddress ?? "",
        accountEmail: data.accountEmail ?? "",
        dateOfBirth: data.dateOfBirth ?? "",
        qualifications: data.qualifications ?? "",
        teacherGender: data.teacherGender !== undefined ? data.teacherGender : false,
      };
    } catch (error) {
      console.error("Error getting teacher details:", error);
      // Fallback to mock mode
      MOCK_MODE = true;
      return await this.getTeacherDetail(token);
    }
  },

  async updateTeacherDetail(token: string, updateDto: {
    teacherName: string;
    teacherPhone: string;
    teacherAddress: string;
    accountEmail: string;
    dateOfBirth: string;
    teacherGender: boolean;
    qualifications: string;
  }) {
    if (MOCK_MODE) {
      console.log("📱 Using mock teacher update (backend offline)");
      // Simulate update delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        ...updateDto,
        username: "teacher_updated"
      };
    }

    try {
      console.log(`Updating teacher with data to ${API_BASE_URL}/teacher/update:`, updateDto);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch(`${API_BASE_URL}/teacher/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateDto),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`updateTeacherDetail failed with status: ${res.status}, body: ${errorBody}`);
        
        if (res.status >= 500) {
          // Server error, try fallback
          await tryNextBackendUrl();
          if (!MOCK_MODE) {
            return await this.updateTeacherDetail(token, updateDto);
          }
        }
        
        return null;
      }

      const data = await res.json();
      console.log("✅ Teacher update response:", data);
      return data;
    } catch (error) {
      console.error("Error updating teacher:", error);
      // Fallback to mock mode
      MOCK_MODE = true;
      return await this.updateTeacherDetail(token, updateDto);
    }
  },

  // Student APIs - New addition
  async getStudentDetail(token: string) {
    if (MOCK_MODE) {
      console.log("📱 Using mock student data (backend offline)");
      return {
        studentName: "Nguyễn Văn A (Mock - Backend Offline)",
        studentPhone: "0987654321", 
        studentAddress: "456 Đường XYZ, Quận 2, TP.HCM",
        accountEmail: "student.mock@example.com",
        dateOfBirth: "2020-01-15",
        studentGender: true,
        height: 100.0,
        weight: 15.5,
        classroomName: "Lớp Mầm A1",
        parentName: "Nguyễn Thị B",
        parentPhone: "0901234567"
      };
    }

    try {
      console.log(`Fetching student detail from ${API_BASE_URL}/student/detail`);
      const res = await fetch(`${API_BASE_URL}/student/detail`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(`getStudentDetail failed with status: ${res.status}`);
        const errorText = await res.text();
        console.error("Error response:", errorText);
        return null;
      }

      const data = await res.json();
      console.log("Get student detail response:", data);

      // Ensure all fields have fallback values
      return {
        ...data,
        studentName: data.studentName ?? "",
        studentPhone: data.studentPhone ?? "",
        studentAddress: data.studentAddress ?? "",
        accountEmail: data.accountEmail ?? "",
        dateOfBirth: data.dateOfBirth ?? "",
        studentGender: data.studentGender !== undefined ? data.studentGender : false,
        height: data.height ?? 0,
        weight: data.weight ?? 0,
        classroomName: data.classroomName ?? "",
        parentName: data.parentName ?? "",
        parentPhone: data.parentPhone ?? "",
      };
    } catch (error) {
      return handleApiError(error, "Get student details failed");
    }
  },

  async updateStudentDetail(token: string, updateDto: {
    studentName: string;
    studentPhone: string; 
    studentAddress: string;
    accountEmail: string;
    dateOfBirth: string;
    studentGender: boolean;
    parentName: string;
    parentPhone: string;
    healthStatus: string; // Required by backend
    hobby: string; // Required by backend
  }) {
    // Add mock mode support for debugging
    if (MOCK_MODE) {
      console.log("📱 Using mock student update (backend offline)");
      // Simulate update delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        ...updateDto,
        username: "student_updated"
      };
    }

    try {
      // Log full request details for debugging
      console.log(`Updating student with data to ${API_BASE_URL}/student/update:`, JSON.stringify(updateDto));
      
      // Ensure all required fields have values
      const safeUpdateDto = {
        ...updateDto,
        healthStatus: updateDto.healthStatus || "Healthy",
        hobby: updateDto.hobby || "None"
      };
      
      const res = await fetch(`${API_BASE_URL}/student/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(safeUpdateDto),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`updateStudentDetail failed with status: ${res.status}, body: ${errorBody}`);
        return null;
      }

      const data = await res.json();
      console.log("Student update response:", data);
      return data;
    } catch (error) {
      return handleApiError(error, "Update student failed");
    }
  },

  async updateStudentMeasurements(token: string, measurementDto: {
    height: number;
    weight: number;
  }) {
    try {
      console.log(`Updating student measurements to ${API_BASE_URL}/student/measurements:`, measurementDto);
      const res = await fetch(`${API_BASE_URL}/student/measurements`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(measurementDto),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`updateStudentMeasurements failed with status: ${res.status}, body: ${errorBody}`);
        return null;
      }

      const data = await res.json();
      console.log("Student measurements update response:", data);
      return data;
    } catch (error) {
      return handleApiError(error, "Update student measurements failed");
    }
  },

  // Album APIs
  async createAlbum(token: string, albumDto: {
    title: string;
    description?: string;
    classroomId?: number;
    activityId?: number;
    images?: string[];
  }) {
    try {
      console.log(`Creating album to ${API_BASE_URL}/albums`, albumDto);

      // Validate required fields
      if (!albumDto.title || albumDto.title.trim() === "") {
        console.error("Album title is required");
        return null;
      }

      const res = await fetch(`${API_BASE_URL}/albums`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          albumName: albumDto.title.trim(), // Map title to albumName để khớp với backend
          description: albumDto.description || "",
          classroomId: albumDto.classroomId || null,
          activityId: albumDto.activityId || null,
          imageUrls: albumDto.images ? albumDto.images.join(", ") : "", // Chuyển mảng thành chuỗi URL
        }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`createAlbum failed with status: ${res.status}, body: ${errorBody}`);
        return null;
      }

      const data = await res.json();
      console.log("Album create response:", data);
      return data;
    } catch (error) {
      return handleApiError(error, "Create album failed");
    }
  },

  async getAlbumsByClassroom(classroomId: number, token?: string) {
    try {
      console.log(`Fetching albums for classroom ${classroomId} from ${API_BASE_URL}/albums/classroom/${classroomId}`);

      // Thêm token vào tất cả các request, kể cả GET
      const headers: any = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/albums/classroom/${classroomId}`, {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        console.error(`getAlbumsByClassroom failed with status: ${res.status}`);
        const errorBody = await res.text();
        console.error("Error response:", errorBody);
        return [];
      }

      const data = await res.json();
      console.log("Get classroom albums response:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching classroom albums:", error);
      return [];
    }
  },

  async getAlbumsByActivity(activityId: number, token?: string) {
    try {
      console.log(`Fetching albums for activity ${activityId} from ${API_BASE_URL}/albums/activity/${activityId}`);

      // Thêm token vào request
      const headers: any = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/albums/activity/${activityId}`, {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        console.error(`getAlbumsByActivity failed with status: ${res.status}`);
        const errorBody = await res.text();
        console.error("Error response:", errorBody);
        return [];
      }

      const data = await res.json();
      console.log("Get activity albums response:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching activity albums:", error);
      return [];
    }
  },

  async getAlbumById(albumId: number, token?: string) {
    try {
      console.log(`Fetching album ${albumId} from ${API_BASE_URL}/albums/${albumId}`);

      // Thêm token vào request
      const headers: any = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const res = await fetch(`${API_BASE_URL}/albums/${albumId}`, {
        method: "GET",
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        console.error(`getAlbumById failed with status: ${res.status}`);
        const errorText = await res.text();
        console.error("Error response:", errorText);
        return null;
      }

      const data = await res.json();
      console.log("Get album response:", data);
      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Get album request timed out");
        return null;
      }
      return handleApiError(error, "Get album failed");
    }
  },

  async updateAlbum(token: string, albumId: number, albumDto: {
    title: string;
    description?: string;
    classroomId?: number;
    activityId?: number;
    images?: string[];
  }) {
    try {
      console.log(`Updating album ${albumId} to ${API_BASE_URL}/albums/${albumId}`);
      const res = await fetch(`${API_BASE_URL}/albums/${albumId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          albumName: albumDto.title, // Map title to albumName để khớp với backend
          description: albumDto.description || "",
          classroomId: albumDto.classroomId || null,
          activityId: albumDto.activityId || null,
          imageUrls: albumDto.images ? albumDto.images.join(", ") : "", // Chuyển mảng thành chuỗi URL
        }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`updateAlbum failed with status: ${res.status}, body: ${errorBody}`);
        return null;
      }

      const data = await res.json();
      console.log("Album update response:", data);
      return data;
    } catch (error) {
      return handleApiError(error, "Update album failed");
    }
  },

  async deleteAlbum(token: string, albumId: number) {
    try {
      console.log(`Deleting album ${albumId} from ${API_BASE_URL}/albums/${albumId}`);
      const res = await fetch(`${API_BASE_URL}/albums/${albumId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`deleteAlbum failed with status: ${res.status}, body: ${errorBody}`);
        return false;
      }

      console.log("Album deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting album:", error);
      return false;
    }
  },

  // Health APIs - Updated to match backend controller
  async createOrUpdateHealthRecord(token: string, healthInfoDTO: HealthInfoDTO): Promise<HealthInfoDTO | null> {
    try {
      console.log(`Creating/updating health record to ${API_BASE_URL}/health-records`, healthInfoDTO);

      if (!healthInfoDTO.studentId) {
        console.error("Student ID is required for health record");
        return null;
      }

      const res = await fetch(`${API_BASE_URL}/health-records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(healthInfoDTO),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`createOrUpdateHealthRecord failed with status: ${res.status}, body: ${errorBody}`);
        return null;
      }

      const result = await res.json() as HealthInfoDTO;
      console.log("Health record saved successfully:", result);
      return result;
    } catch (error) {
      return handleApiError(error, "Create/Update health record failed");
    }
  },

  async getHealthRecord(token: string, studentId: number): Promise<HealthInfoDTO | null> {
    try {
      console.log(`Fetching health record for student ${studentId} from ${API_BASE_URL}/health-records/${studentId}`);
      const res = await fetch(`${API_BASE_URL}/health-records/${studentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(`getHealthRecord failed with status: ${res.status}`);
        if (res.status === 404) return null;
        return null;
      }
      return await res.json() as HealthInfoDTO;
    } catch (error) {
      return handleApiError(error, "Get health record failed");
    }
  },

  async createHealthReminder(token: string, reminderDTO: CreateHealthReminderDTO, studentId: number): Promise<AnnouncementDTO | null> {
    try {
      console.log(`Creating health reminder for student ${studentId} to ${API_BASE_URL}/health-reminders?studentId=${studentId}`, reminderDTO);
      const res = await fetch(`${API_BASE_URL}/health-reminders?studentId=${studentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reminderDTO),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`createHealthReminder failed with status: ${res.status}, body: ${errorBody}`);
        return null;
      }
      return await res.json() as AnnouncementDTO;
    } catch (error) {
      return handleApiError(error, "Create health reminder failed");
    }
  },

  async createGrowthRecord(token: string, growthRecordDTO: GrowthRecordDTO): Promise<GrowthRecordDTO | null> {
    try {
      console.log(`Creating growth record to ${API_BASE_URL}/growth-records`, growthRecordDTO);
      const res = await fetch(`${API_BASE_URL}/growth-records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(growthRecordDTO),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`createGrowthRecord failed with status: ${res.status}, body: ${errorBody}`);
        return null;
      }
      return await res.json() as GrowthRecordDTO;
    } catch (error) {
      return handleApiError(error, "Create growth record failed");
    }
  },

  async updateGrowthRecord(token: string, growthRecordId: number, growthRecordDTO: GrowthRecordDTO): Promise<GrowthRecordDTO | null> {
    try {
      console.log(`Updating growth record ${growthRecordId} to ${API_BASE_URL}/growth-records/${growthRecordId}`, growthRecordDTO);
      const res = await fetch(`${API_BASE_URL}/growth-records/${growthRecordId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(growthRecordDTO),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`updateGrowthRecord failed with status: ${res.status}, body: ${errorBody}`);
        return null;
      }
      return await res.json() as GrowthRecordDTO;
    } catch (error) {
      return handleApiError(error, "Update growth record failed");
    }
  },

  async getGrowthRecords(token: string, studentId: number): Promise<GrowthRecordDTO[]> {
    try {
      console.log(`Fetching growth records for student ${studentId} from ${API_BASE_URL}/growth-records/${studentId}`);
      const res = await fetch(`${API_BASE_URL}/growth-records/${studentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(`getGrowthRecords failed with status: ${res.status}`);
        return [];
      }
      const data = await res.json();
      return Array.isArray(data) ? data as GrowthRecordDTO[] : [];
    } catch (error) {
      handleApiError(error, "Get growth records failed");
      return [];
    }
  },

  async getGrowthChartData(token: string, studentId: number): Promise<any[]> {
    try {
      console.log(`Fetching growth chart data for student ${studentId} from ${API_BASE_URL}/growth-records/${studentId}/chart-data`);
      const res = await fetch(`${API_BASE_URL}/growth-records/${studentId}/chart-data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(`getGrowthChartData failed with status: ${res.status}`);
        return [];
      }
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      handleApiError(error, "Get growth chart data failed");
      return [];
    }
  },

  // Nutrition APIs (if backend supports them)
  async getNutritionMenus(token: string, classroomId: number, healthCondition: string): Promise<any[]> {
    try {
      console.log(`Fetching nutrition menus for classroom ${classroomId}, condition ${healthCondition}`);
      const res = await fetch(`${API_BASE_URL}/nutrition/menus?classroomId=${classroomId}&healthCondition=${healthCondition}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.warn(`getNutritionMenus failed with status: ${res.status} - API endpoint may not exist yet`);
        return [];
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn("Nutrition menus API not available:", error.message);
      return [];
    }
  },

  async getNutritionLogs(token: string, classroomId: number): Promise<any[]> {
    try {
      console.log(`Fetching nutrition logs for classroom ${classroomId}`);
      const res = await fetch(`${API_BASE_URL}/nutrition/logs?classroomId=${classroomId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.warn(`getNutritionLogs failed with status: ${res.status}`);
        return [];
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn("Nutrition logs API not available:", error.message);
      return [];
    }
  },

  async createNutritionLog(token: string, logData: any): Promise<boolean> {
    try {
      console.log(`Creating nutrition log to ${API_BASE_URL}/nutrition/logs`);
      const res = await fetch(`${API_BASE_URL}/nutrition/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(logData),
      });

      return res.ok;
    } catch (error) {
      console.warn("Nutrition log creation API not available:", error.message);
      return false;
    }
  },

  async sendMealReminder(token: string, reminderData: any): Promise<boolean> {
    try {
      console.log(`Sending meal reminder to ${API_BASE_URL}/nutrition/reminders`);
      const res = await fetch(`${API_BASE_URL}/nutrition/reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reminderData),
      });

      return res.ok;
    } catch (error) {
      console.warn("Meal reminder API not available:", error.message);
      return false;
    }
  },

  // Add missing API methods that are referenced in medicine_page
  async getHealthStatistics(token: string, studentId: number): Promise<any> {
    try {
      console.log(`Fetching health statistics for student ${studentId}`);
      const res = await fetch(`${API_BASE_URL}/health-statistics/${studentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.warn(`getHealthStatistics failed with status: ${res.status}`);
        return null;
      }
      return await res.json();
    } catch (error) {
      console.warn("Health statistics API not available:", error);
      return null;
    }
  },

  async getLatestGrowthRecord(token: string, studentId: number): Promise<any> {
    try {
      console.log(`Fetching latest growth record for student ${studentId}`);
      const res = await fetch(`${API_BASE_URL}/growth-records/${studentId}/latest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.warn(`getLatestGrowthRecord failed with status: ${res.status}`);
        return null;
      }
      return await res.json();
    } catch (error) {
      console.warn("Latest growth record API not available:", error);
      return null;
    }
  },

  async getVaccinationHistory(token: string, studentId: number): Promise<any[]> {
    try {
      console.log(`Fetching vaccination history for student ${studentId}`);
      const res = await fetch(`${API_BASE_URL}/vaccinations/${studentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.warn(`getVaccinationHistory failed with status: ${res.status}`);
        return [];
      }
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn("Vaccination history API not available:", error);
      return [];
    }
  },

  async addVaccinationRecord(token: string, studentId: number, vaccination: any): Promise<boolean> {
    try {
      console.log(`Adding vaccination record for student ${studentId}`, vaccination);
      const res = await fetch(`${API_BASE_URL}/vaccinations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId,
          ...vaccination,
        }),
      });

      return res.ok;
    } catch (error) {
      console.warn("Add vaccination record API not available:", error);
      return false;
    }
  },

  async deleteGrowthRecord(token: string, growthRecordId: number): Promise<boolean> {
    try {
      console.log(`Deleting growth record ${growthRecordId}`);
      const res = await fetch(`${API_BASE_URL}/growth-records/${growthRecordId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return res.ok;
    } catch (error) {
      console.warn("Delete growth record API not available:", error);
      return false;
    }
  },

  // Chat APIs - Fixed endpoints and improved error handling
  async sendMessage(
    token: string, 
    classroomId: number, 
    receiverId: number, 
    isTeacher: boolean, 
    content: string
  ): Promise<ChatMessageDTO | null> {
    if (MOCK_MODE) {
      console.log("📱 Using mock chat send (backend offline)");
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: Date.now() + Math.random(),
        senderId: isTeacher ? 1 : receiverId,
        receiverId: isTeacher ? receiverId : 1,
        content,
        timestamp: new Date().toISOString(),
        classroomId,
        isTeacherSender: isTeacher,
        senderName: isTeacher ? "Giáo viên" : "Phụ huynh",
      };
    }

    try {
      // Use the working send endpoint
      const endpoint = `/chat/send?classroomId=${classroomId}&receiverId=${receiverId}&isTeacher=${isTeacher}`;
      
      console.log(`Sending message to ${API_BASE_URL}${endpoint}`, {
        classroomId,
        receiverId,
        isTeacher,
        content
      });
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content), // Send as plain string, not object
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Send message failed with status: ${res.status}, error: ${errorText}`);
        return null;
      }

      const data = await res.json();
      console.log("✅ Send message success:", data);
      
      // Map response to expected format
      return {
        id: data.messageId || Date.now(),
        senderId: isTeacher ? data.teacherId : data.parentId,
        receiverId: isTeacher ? data.parentId : data.teacherId,
        content: content, // Use original content, not from response
        timestamp: data.timestamp || new Date().toISOString(),
        classroomId: data.classroomId || classroomId,
        isTeacherSender: isTeacher,
        senderName: isTeacher ? "Giáo viên" : "Phụ huynh",
      };
      
    } catch (error) {
      console.error("Send message error:", error);
      return null;
    }
  },

  async getChatHistory(
    token: string,
    classroomId: number,
    receiverId: number,
    isTeacher: boolean
  ): Promise<ChatMessageDTO[]> {
    if (MOCK_MODE) {
      console.log("📱 Using mock chat history (backend offline)");
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
      return [
        {
          id: 1,
          senderId: isTeacher ? receiverId : 1,
          receiverId: isTeacher ? 1 : receiverId,
          content: "Chào cô/anh! Con có câu hỏi về bài học hôm nay ạ.",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          classroomId,
          isTeacherSender: false,
          senderName: "Phụ huynh",
        },
        {
          id: 2,
          senderId: isTeacher ? 1 : receiverId,
          receiverId: isTeacher ? receiverId : 1,
          content: "Chào em! Cô luôn sẵn sàng giúp em. Em hỏi đi nhé!",
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          classroomId,
          isTeacherSender: true,
          senderName: "Giáo viên",
        },
        {
          id: 3,
          senderId: isTeacher ? receiverId : 1,
          receiverId: isTeacher ? 1 : receiverId,
          content: "Cảm ơn cô! Con muốn hỏi về bài toán hôm nay.",
          timestamp: new Date(Date.now() - 900000).toISOString(),
          classroomId,
          isTeacherSender: false,
          senderName: "Phụ huynh",
        },
      ];
    }

    try {
      // Try the working chat history endpoint first
      const endpoint = `/chat/history?classroomId=${classroomId}&receiverId=${receiverId}&isTeacher=${isTeacher}`;
      
      console.log(`Fetching chat history from ${API_BASE_URL}${endpoint}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Chat history failed with status: ${res.status}, error: ${errorText}`);
        return [];
      }
      
      const data = await res.json();
      console.log("✅ Chat history success:", data);
      
      if (!Array.isArray(data)) {
        console.warn("Chat history response is not an array:", data);
        return [];
      }
      
      // Fix: Improved mapping for backend ChatMessage response
      return data.map((msg, index) => {
        // Clean up content - remove escaped JSON strings
        let cleanContent = msg.content || '';
        
        // Handle escaped JSON content like "{\"content\":\"Lo\"}"
        if (cleanContent.startsWith('{"content":') && cleanContent.endsWith('}')) {
          try {
            const parsed = JSON.parse(cleanContent);
            cleanContent = parsed.content || cleanContent;
          } catch (e) {
            console.warn("Could not parse JSON content:", cleanContent);
          }
        }
        
        // Handle simple escaped strings like "\"cho\""
        if (cleanContent.startsWith('"') && cleanContent.endsWith('"')) {
          cleanContent = cleanContent.slice(1, -1); // Remove quotes
        }
        
        // Determine sender based on backend response structure
        // If message has teacherId, it means teacher sent it
        // If message has parentId, it means parent sent it
        const messageIsFromTeacher = !!msg.teacherId && !msg.parentId;
        const messageIsFromParent = !!msg.parentId && !msg.teacherId;
        
        // For the current user context
        const currentUserIsTeacher = isTeacher;
        
        return {
          id: msg.messageId || msg.id || (Date.now() + index),
          senderId: messageIsFromTeacher ? msg.teacherId : msg.parentId,
          receiverId: messageIsFromTeacher ? msg.parentId : msg.teacherId,
          content: cleanContent,
          timestamp: msg.timestamp || new Date().toISOString(),
          classroomId: msg.classroomId || classroomId,
          isTeacherSender: messageIsFromTeacher,
          senderName: messageIsFromTeacher ? 
            (msg.senderName || "Giáo viên") : 
            (msg.senderName || "Phụ huynh"),
        };
      }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // Sort by timestamp
      
    } catch (error) {
      console.error("Error fetching chat history:", error);
      return [];
    }
  },
};

// Define chat interfaces
interface ChatMessageDTO {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  classroomId: number;
  isTeacherSender: boolean;
  senderName?: string;
}

// Define teacher interface to match backend TeacherUserDetailDto
interface TeacherUserDetailDto {
  teacherName: string;
  teacherPhone: string;
  teacherAddress: string;
  accountEmail: string;
  dateOfBirth: string; // ISO date string
  teacherGender: boolean; // true for male, false for female
  qualifications: string;
  username?: string;
}

// Export functions for mock mode and connection status
export const isUsingMockMode = () => MOCK_MODE;

export const enableMockMode = () => {
  MOCK_MODE = true;
  console.log("🔄 Mock mode enabled");
};

export const disableMockMode = () => {
  MOCK_MODE = false;
  console.log("🔄 Mock mode disabled");
};

export const getCurrentMode = () => {
  if (MOCK_MODE) {
    return "Chế độ demo (Backend offline)";
  }
  return CONNECTION_TESTED ? "Kết nối thành công" : "Đang kiểm tra...";
};

// Fix: Properly export authApi
export const authApi = authApiObject;