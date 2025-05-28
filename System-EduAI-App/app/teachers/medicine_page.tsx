import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  ListRenderItem,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { authApi, publicApi } from "../services/api";

// Define local interfaces to avoid import issues
interface GrowthRecordDTO {
  growthRecordId?: number;
  studentId: number;
  date: string;
  height: number;
  weight: number;
  notes?: string;
}

interface CreateHealthReminderDTO {
  title: string;
  content: string;
  reminderDate: string;
  type: string;
}

interface AnnouncementDTO {
  announcementId?: number;
  title: string;
  content: string;
  type: string;
  createdAt?: string;
  studentId?: number;
  classroomId?: number;
}

interface HealthInfoDTO {
  studentId: number;
  bloodType?: string;
  allergies?: string;
  currentWeight?: number;
  currentHeight?: number;
  healthCondition?: string;
  notes?: string;
  medications?: string;
  medicalHistory?: string;
  emergencyContact?: string;
  doctorNotes?: string;
}

// Interface cho Child (đã có, giữ nguyên nếu phù hợp)
interface Child {
  id: string; // This will be studentId (number) for API calls
  name?: string; // Optional: for display
  height?: number; // from params, if any
  weight?: number; // from params, if any
}

// Interface cho route params (đã có, giữ nguyên)
type MedicinePageRouteParams = {
  child: Child; // Should be stringified JSON or individual params
};

const MedicinePage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { token } = useAuth();

  const [child, setChild] = useState<Child | null>(null);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecordDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // States for creating/editing Growth Record
  const [editingGrowthRecordId, setEditingGrowthRecordId] = useState<
    number | null
  >(null);
  const [newRecordDate, setNewRecordDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newHeight, setNewHeight] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [newGrowthNotes, setNewGrowthNotes] = useState("");

  // States for creating Health Reminder
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderContent, setReminderContent] = useState("");

  // Thêm states cho vaccination và health statistics
  const [healthStats, setHealthStats] = useState<any>(null);
  const [latestGrowthRecord, setLatestGrowthRecord] =
    useState<GrowthRecordDTO | null>(null);
  const [vaccinationHistory, setVaccinationHistory] = useState<any[]>([]);
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);
  const [newVaccination, setNewVaccination] = useState({
    vaccineName: "",
    vaccinationDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Thêm states cho health record và chart data
  const [healthRecord, setHealthRecord] = useState<HealthInfoDTO | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [showHealthRecordForm, setShowHealthRecordForm] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);

  // States cho health record form
  const [healthRecordData, setHealthRecordData] = useState({
    allergies: "",
    medications: "",
    medicalHistory: "",
    bloodType: "",
    emergencyContact: "",
    doctorNotes: "",
  });

  // Thêm states cho việc chọn học sinh
  const [students, setStudents] = useState<any[]>([]);
  const [showStudentPicker, setShowStudentPicker] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    // Safely parse child from params
    if (params.child) {
      try {
        const parsedChild = JSON.parse(params.child as string) as Child;
        setChild(parsedChild);
      } catch (e) {
        console.error("Failed to parse child from params:", e);
        // Fallback or handle error if child id is directly passed
        if (params.childId) {
          setChild({
            id: params.childId as string,
            name: (params.childName as string) || "N/A",
          });
        } else {
          Alert.alert("Lỗi", "Không có thông tin học sinh.");
          router.back();
        }
      }
    } else if (params.childId) {
      // Fallback if childId is passed directly
      setChild({
        id: params.childId as string,
        name: (params.childName as string) || "N/A",
      });
    } else {
      Alert.alert("Lỗi", "Không có thông tin học sinh.");
      router.back();
    }
  }, [params]);

  const fetchGrowthRecords = useCallback(
    async (studentId: number) => {
      if (!token) {
        Alert.alert("Lỗi", "Yêu cầu đăng nhập.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await authApi.getGrowthRecords(token, studentId);
        setGrowthRecords(data || []);
      } catch (error) {
        console.error("Error fetching growth records:", error);
        Alert.alert("Lỗi", "Không thể tải dữ liệu tăng trưởng.");
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const fetchHealthData = useCallback(
    async (studentId: number) => {
      if (!token) return;

      try {
        // Fetch health statistics
        const stats = await authApi.getHealthStatistics(token, studentId);
        setHealthStats(stats);

        // Fetch latest growth record
        const latest = await authApi.getLatestGrowthRecord(token, studentId);
        setLatestGrowthRecord(latest);

        // Fetch vaccination history
        const vaccinations = await authApi.getVaccinationHistory(
          token,
          studentId
        );
        setVaccinationHistory(vaccinations);
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    },
    [token]
  );

  const fetchHealthRecord = useCallback(
    async (studentId: number) => {
      if (!token) return;

      try {
        setIsLoading(true);
        const record = await authApi.getHealthRecord(token, studentId);
        setHealthRecord(record);

        if (record) {
          setHealthRecordData({
            allergies: record.allergies || "",
            medications: record.medications || "",
            medicalHistory: record.medicalHistory || "",
            bloodType: record.bloodType || "",
            emergencyContact: record.emergencyContact || "",
            doctorNotes: record.doctorNotes || "",
          });
        }
      } catch (error) {
        console.error("Error fetching health record:", error);
        Alert.alert("Lỗi", "Không thể tải hồ sơ sức khỏe.");
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const fetchChartData = useCallback(
    async (studentId: number) => {
      if (!token) return;

      try {
        const data = await authApi.getGrowthChartData(token, studentId);
        setChartData(data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    },
    [token]
  );

  useEffect(() => {
    if (child && child.id) {
      const studentIdNumber = parseInt(child.id, 10);
      if (!isNaN(studentIdNumber)) {
        fetchGrowthRecords(studentIdNumber);
        fetchHealthData(studentIdNumber);
        fetchHealthRecord(studentIdNumber);
        fetchChartData(studentIdNumber);
      }
    }
  }, [
    child,
    fetchGrowthRecords,
    fetchHealthData,
    fetchHealthRecord,
    fetchChartData,
  ]);

  const resetGrowthForm = () => {
    setEditingGrowthRecordId(null);
    setNewRecordDate(new Date().toISOString().split("T")[0]);
    setNewHeight("");
    setNewWeight("");
    setNewGrowthNotes("");
  };

  const handleSaveGrowthRecord = async () => {
    if (
      !token ||
      !child ||
      !child.id ||
      !newHeight ||
      !newWeight ||
      !newRecordDate
    ) {
      Alert.alert(
        "Lỗi",
        "Vui lòng nhập đầy đủ thông tin tăng trưởng (ngày, chiều cao, cân nặng)."
      );
      return;
    }
    const studentIdNumber = parseInt(child.id, 10);
    if (isNaN(studentIdNumber)) {
      Alert.alert("Lỗi", "ID học sinh không hợp lệ.");
      return;
    }

    const recordPayload: GrowthRecordDTO = {
      // Ensure growthRecordId is not part of the payload for create
      ...(editingGrowthRecordId && { growthRecordId: editingGrowthRecordId }),
      studentId: studentIdNumber,
      recordDate: newRecordDate,
      height: parseFloat(newHeight),
      weight: parseFloat(newWeight),
      notes: newGrowthNotes,
    };

    setIsLoading(true);
    try {
      let result: GrowthRecordDTO | null = null;
      if (editingGrowthRecordId) {
        result = await authApi.updateGrowthRecord(
          token,
          editingGrowthRecordId,
          recordPayload
        );
        if (result) {
          Alert.alert("Thành công", "Đã cập nhật bản ghi tăng trưởng.");
        }
      } else {
        // For creation, ensure growthRecordId is not sent if backend auto-generates it
        const createPayload = { ...recordPayload };
        delete createPayload.growthRecordId;
        result = await authApi.createGrowthRecord(token, createPayload);
        if (result) {
          Alert.alert("Thành công", "Đã thêm bản ghi tăng trưởng.");
        }
      }

      if (result) {
        fetchGrowthRecords(studentIdNumber); // Refresh list
        resetGrowthForm(); // Clear form and reset editing state
      } else {
        Alert.alert(
          "Lỗi",
          editingGrowthRecordId
            ? "Không thể cập nhật bản ghi."
            : "Không thể thêm bản ghi."
        );
      }
    } catch (error) {
      console.error("Error saving growth record:", error);
      Alert.alert(
        "Lỗi",
        `Lỗi khi ${
          editingGrowthRecordId ? "cập nhật" : "thêm"
        } bản ghi tăng trưởng.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditGrowthRecord = (record: GrowthRecordDTO) => {
    setEditingGrowthRecordId(record.growthRecordId!);
    setNewRecordDate(record.recordDate.split("T")[0]); // Ensure date is in YYYY-MM-DD
    setNewHeight(record.height.toString());
    setNewWeight(record.weight.toString());
    setNewGrowthNotes(record.notes || "");
    // Scroll to form or focus first input if desired
  };

  const handleCreateHealthReminder = async () => {
    if (!token || !child || !child.id || !reminderTitle || !reminderContent) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề và nội dung lời nhắc.");
      return;
    }
    const studentIdNumber = parseInt(child.id, 10);
    if (isNaN(studentIdNumber)) {
      Alert.alert("Lỗi", "ID học sinh không hợp lệ.");
      return;
    }

    const reminder: CreateHealthReminderDTO = {
      // Using CreateHealthReminderDTO
      title: reminderTitle,
      content: reminderContent,
      type: "HEALTH_REMINDER", // Ensure this type matches backend expectations for AnnouncementDTO
    };

    setIsLoading(true);
    try {
      const result: AnnouncementDTO | null = await authApi.createHealthReminder(
        token,
        reminder,
        studentIdNumber
      );
      if (result && result.announcementId) {
        // Check for a valid response
        Alert.alert(
          "Thành công",
          "Đã tạo lời nhắc sức khỏe (dặn thuốc).\nLời nhắc này sẽ được gửi như một thông báo."
        );
        setReminderTitle("");
        setReminderContent("");
      } else {
        Alert.alert("Lỗi", "Không thể tạo lời nhắc sức khỏe.");
      }
    } catch (error) {
      console.error("Error creating health reminder:", error);
      Alert.alert("Lỗi", "Lỗi khi tạo lời nhắc sức khỏe.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGrowthRecord = async (growthRecordId: number) => {
    if (!token) {
      Alert.alert("Lỗi", "Yêu cầu đăng nhập.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await authApi.deleteGrowthRecord(token, growthRecordId);
      if (result) {
        Alert.alert("Thành công", "Đã xóa bản ghi tăng trưởng.");
        fetchGrowthRecords(parseInt(child.id, 10)); // Refresh list
      } else {
        Alert.alert("Lỗi", "Không thể xóa bản ghi tăng trưởng.");
      }
    } catch (error) {
      console.error("Error deleting growth record:", error);
      Alert.alert("Lỗi", "Lỗi khi xóa bản ghi tăng trưởng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVaccination = async () => {
    if (
      !token ||
      !child ||
      !newVaccination.vaccineName ||
      !newVaccination.vaccinationDate
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin tiêm chủng.");
      return;
    }

    const studentIdNumber = parseInt(child.id, 10);
    if (isNaN(studentIdNumber)) {
      Alert.alert("Lỗi", "ID học sinh không hợp lệ.");
      return;
    }

    setIsLoading(true);
    try {
      const success = await authApi.addVaccinationRecord(
        token,
        studentIdNumber,
        newVaccination
      );
      if (success) {
        Alert.alert("Thành công", "Đã thêm thông tin tiêm chủng.");
        setNewVaccination({
          vaccineName: "",
          vaccinationDate: new Date().toISOString().split("T")[0],
          notes: "",
        });
        setShowVaccinationForm(false);
        fetchHealthData(studentIdNumber);
      } else {
        Alert.alert("Lỗi", "Không thể thêm thông tin tiêm chủng.");
      }
    } catch (error) {
      console.error("Error adding vaccination:", error);
      Alert.alert("Lỗi", "Lỗi khi thêm thông tin tiêm chủng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveHealthRecord = async () => {
    if (!token || !child) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin học sinh.");
      return;
    }

    const studentIdNumber = parseInt(child.id, 10);
    if (isNaN(studentIdNumber)) {
      Alert.alert("Lỗi", "ID học sinh không hợp lệ.");
      return;
    }

    // Kiểm tra ít nhất một trường được điền
    const hasData = Object.values(healthRecordData).some(
      (value) => value.trim() !== ""
    );
    if (!hasData) {
      Alert.alert("Lỗi", "Vui lòng điền ít nhất một thông tin sức khỏe.");
      return;
    }

    setIsLoading(true);
    try {
      const healthInfoDTO = {
        studentId: studentIdNumber,
        ...healthRecordData,
      };

      console.log(
        "Saving health record for student:",
        studentIdNumber,
        healthInfoDTO
      );

      const result = await authApi.createOrUpdateHealthRecord(
        token,
        healthInfoDTO
      );
      if (result) {
        Alert.alert(
          "Thành công",
          `Đã lưu hồ sơ sức khỏe cho học sinh ${child.name || child.id}.`
        );
        setHealthRecord(result);
        setShowHealthRecordForm(false);
      } else {
        Alert.alert("Lỗi", "Không thể lưu hồ sơ sức khỏe.");
      }
    } catch (error) {
      console.error("Error saving health record:", error);
      Alert.alert("Lỗi", "Lỗi khi lưu hồ sơ sức khỏe.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderGrowthRecordItem: ListRenderItem<GrowthRecordDTO> = ({
    item,
  }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordDetails}>
        <Text style={styles.recordDate}>
          Ngày: {item.recordDate.split("T")[0]}
        </Text>
        <Text>Chiều cao: {item.height} cm</Text>
        <Text>Cân nặng: {item.weight} kg</Text>
        {item.notes && <Text>Ghi chú: {item.notes}</Text>}
      </View>
      <View style={styles.recordActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditGrowthRecord(item)}
        >
          <Ionicons name="pencil" size={20} color="#4DB6AC" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteGrowthRecord(item.growthRecordId!)}
        >
          <Ionicons name="trash" size={20} color="#E57373" />
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await publicApi.testConnection();
        if (!isConnected) {
          setConnectionError(
            "Không thể kết nối đến máy chủ. Một số tính năng có thể không hoạt động."
          );
        } else {
          setConnectionError(null);
        }
      } catch (error) {
        setConnectionError("Lỗi kiểm tra kết nối mạng.");
      }
    };

    checkConnection();
  }, []);

  // Cập nhật function để fetch danh sách học sinh với fallback
  const fetchStudents = useCallback(async () => {
    if (!token) return;

    try {
      // Thử gọi API trước
      const studentList = await authApi.getStudents(token);
      if (studentList && studentList.length > 0) {
        setStudents(studentList);
      } else {
        // Sử dụng mock data khi API không có
        setStudents([
          { id: 1, name: "Nguyễn Văn A", className: "Lớp Mầm" },
          { id: 2, name: "Trần Thị B", className: "Lớp Chồi" },
          { id: 3, name: "Lê Văn C", className: "Lớp Lá" },
          { id: 4, name: "Phạm Thị D", className: "Lớp Mầm" },
          { id: 5, name: "Hoàng Văn E", className: "Lớp Chồi" },
        ]);
      }
    } catch (error) {
      console.warn("API students not available, using mock data");
      // Luôn fallback về mock data khi lỗi
      setStudents([
        { id: 1, name: "Nguyễn Văn A", className: "Lớp Mầm" },
        { id: 2, name: "Trần Thị B", className: "Lớp Chồi" },
        { id: 3, name: "Lê Văn C", className: "Lớp Lá" },
        { id: 4, name: "Phạm Thị D", className: "Lớp Mầm" },
        { id: 5, name: "Hoàng Văn E", className: "Lớp Chồi" },
      ]);
    }
  }, [token]);

  useEffect(() => {
    fetchStudents();

    // Nếu có thông tin học sinh từ params, set làm selected
    if (params.child) {
      try {
        const parsedChild = JSON.parse(params.child as string);
        setSelectedStudent(parsedChild);
        setChild(parsedChild);
      } catch (e) {
        // Handle parsing error - không làm gì nếu parse fail
      }
    } else if (params.childId) {
      // Fallback nếu chỉ có childId
      const mockStudent = {
        id: params.childId as string,
        name: (params.childName as string) || `Student ${params.childId}`,
      };
      setSelectedStudent(mockStudent);
      setChild(mockStudent);
    }
  }, [fetchStudents, params]);

  const handleSelectStudent = (student: any) => {
    setSelectedStudent(student);
    setChild({
      id: student.id.toString(),
      name: student.name,
    });
    setShowStudentPicker(false);

    // Reset form data khi chọn học sinh mới
    resetGrowthForm();
    setHealthRecordData({
      allergies: "",
      medications: "",
      medicalHistory: "",
      bloodType: "",
      emergencyContact: "",
      doctorNotes: "",
    });
    setHealthRecord(null);
    setGrowthRecords([]);
  };

  // Add safe navigation helpers
  const safeNavigateBack = () => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/teachers/home");
      }
    } catch (error) {
      console.warn("Navigation error:", error);
      router.replace("/teachers/home");
    }
  };

  if (isLoading && growthRecords.length === 0 && !child) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dinh Dưỡng & Sức Khỏe</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Chức năng đang phát triển</Text>
        <Text style={styles.description}>
          Tính năng quản lý dinh dưỡng và sức khỏe sẽ được cập nhật trong phiên
          bản tiếp theo.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#4DB6AC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
});

export default MedicinePage;
