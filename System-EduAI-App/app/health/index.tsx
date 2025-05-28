import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";

type HealthInfoDTO = {
  id?: number;
  studentId: number;
  height: number;
  weight: number;
  bmi?: number;
  bloodType?: string;
  allergies?: string;
  notes?: string;
};

type GrowthRecordDTO = {
  id?: number;
  studentId: number;
  date: string;
  height: number;
  weight: number;
};

type ChartPoint = {
  date: string;
  height: number;
  weight: number;
};

// Thêm types cho nutrition
type NutritionMenuDTO = {
  menuId: number;
  mealType: string;
  foodItems: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthCondition: string;
  classroomId: number;
};

type NutritionLogDTO = {
  logId: number;
  studentId: number;
  menuId: number;
  mealDate: string;
  completionStatus: string;
  notes?: string;
};

type CreateNutritionLogRequest = {
  studentId: number;
  menuId: number;
  mealDate: string;
  completionStatus: string;
  notes?: string;
};

const HealthPage = () => {
  const { token } = useAuth();
  const [studentId, setStudentId] = useState<number>(1);
  const [classroomId, setClassroomId] = useState<number>(1);
  const [healthInfo, setHealthInfo] = useState<HealthInfoDTO | null>(null);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecordDTO[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editHealth, setEditHealth] = useState<HealthInfoDTO | null>(null);
  const [showGrowthModal, setShowGrowthModal] = useState(false);
  const [editGrowth, setEditGrowth] = useState<GrowthRecordDTO | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Thêm states cho nutrition
  const [nutritionMenus, setNutritionMenus] = useState<NutritionMenuDTO[]>([]);
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLogDTO[]>([]);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [selectedHealthCondition, setSelectedHealthCondition] =
    useState<string>("NORMAL");
  const [newNutritionLog, setNewNutritionLog] =
    useState<CreateNutritionLogRequest>({
      studentId: 1,
      menuId: 0,
      mealDate: new Date().toISOString().split("T")[0],
      completionStatus: "COMPLETED",
    });

  const studentOptions = [
    { id: 1, name: "Nguyễn Văn A", classroomId: 1 },
    { id: 2, name: "Trần Thị B", classroomId: 1 },
    { id: 3, name: "Lê Văn C", classroomId: 2 },
  ];

  const healthConditions = [
    { value: "NORMAL", label: "Bình thường" },
    { value: "ALLERGIC", label: "Dị ứng" },
    { value: "DIABETIC", label: "Tiểu đường" },
    { value: "OVERWEIGHT", label: "Thừa cân" },
    { value: "UNDERWEIGHT", label: "Thiếu cân" },
  ];

  // Lấy thông tin sức khỏe tổng quát
  const fetchHealthInfo = async () => {
    if (!token) {
      Alert.alert(
        "Lỗi xác thức",
        "Bạn cần đăng nhập để xem thông tin sức khỏe."
      );
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.getHealthRecord(token, studentId);
      setHealthInfo(data);
    } catch (e) {
      Alert.alert("Lỗi", "Không thể tải thông tin sức khỏe");
    } finally {
      setLoading(false);
    }
  };

  // Lấy lịch sử tăng trưởng
  const fetchGrowthRecords = async () => {
    if (!token) {
      Alert.alert(
        "Lỗi xác thức",
        "Bạn cần đăng nhập để xem lịch sử tăng trưởng."
      );
      return;
    }

    try {
      const data = await authApi.getGrowthRecords(token, studentId);
      setGrowthRecords(data);
    } catch (e) {
      Alert.alert("Lỗi", "Không thể tải lịch sử tăng trưởng");
    }
  };

  // Lấy dữ liệu biểu đồ tăng trưởng
  const fetchChartData = async () => {
    if (!token) return;

    try {
      const data = await authApi.getGrowthChartData(token, studentId);
      setChartData(data);
    } catch (e) {
      console.warn("Chart data not available");
    }
  };

  // Thêm/sửa thông tin sức khỏe
  const handleSaveHealth = async () => {
    if (!editHealth || !token) return;

    try {
      const result = await authApi.createOrUpdateHealthRecord(
        token,
        editHealth
      );
      if (result) {
        setShowEditModal(false);
        fetchHealthInfo();
        Alert.alert("Thành công", "Cập nhật thông tin sức khỏe thành công!");
      } else {
        Alert.alert("Lỗi", "Không thể cập nhật thông tin sức khỏe");
      }
    } catch (e) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin sức khỏe");
    }
  };

  // Thêm/sửa tăng trưởng
  const handleSaveGrowth = async () => {
    if (!editGrowth || !token) return;

    try {
      let result;
      if (editGrowth.id) {
        result = await authApi.updateGrowthRecord(
          token,
          editGrowth.id,
          editGrowth
        );
      } else {
        result = await authApi.createGrowthRecord(token, editGrowth);
      }

      if (result) {
        setShowGrowthModal(false);
        fetchGrowthRecords();
        fetchChartData();
        Alert.alert("Thành công", "Cập nhật tăng trưởng thành công!");
      } else {
        Alert.alert("Lỗi", "Không thể cập nhật tăng trưởng");
      }
    } catch (e) {
      Alert.alert("Lỗi", "Không thể cập nhật tăng trưởng");
    }
  };

  // Gửi nhắc nhở sức khỏe (giáo viên)
  const handleSendReminder = async () => {
    if (!token) {
      Alert.alert("Lỗi xác thức", "Bạn cần đăng nhập để gửi nhắc nhở.");
      return;
    }

    try {
      const reminderData = {
        title: "Nhắc nhở sức khỏe",
        content: "Vui lòng kiểm tra sức khỏe cho bé.",
        type: "HEALTH_REMINDER",
      };

      const result = await authApi.createHealthReminder(
        token,
        reminderData,
        studentId
      );
      if (result) {
        Alert.alert("Thành công", "Đã gửi nhắc nhở sức khỏe!");
      } else {
        Alert.alert("Lỗi", "Không thể gửi nhắc nhở");
      }
    } catch (e) {
      Alert.alert("Lỗi", "Không thể gửi nhắc nhở");
    }
  };

  // Thêm functions cho nutrition APIs
  const fetchNutritionMenus = async () => {
    if (!token) return;

    try {
      const data = await authApi.getNutritionMenus(
        token,
        classroomId,
        selectedHealthCondition
      );
      setNutritionMenus(data);
    } catch (error) {
      console.warn("Nutrition menus API not available");
      setNutritionMenus([]);
    }
  };

  const fetchNutritionLogs = async () => {
    if (!token) return;

    try {
      const data = await authApi.getNutritionLogs(token, classroomId);
      setNutritionLogs(data);
    } catch (error) {
      console.warn("Nutrition logs API not available");
      setNutritionLogs([]);
    }
  };

  const createNutritionLog = async () => {
    if (!newNutritionLog.menuId) {
      Alert.alert("Lỗi", "Vui lòng chọn thực đơn");
      return;
    }

    if (!token) {
      Alert.alert("Lỗi xác thức", "Bạn cần đăng nhập để ghi nhận bữa ăn.");
      return;
    }

    try {
      const success = await authApi.createNutritionLog(token, newNutritionLog);
      if (success) {
        Alert.alert("Thành công", "Đã ghi nhận bữa ăn!");
        setShowNutritionModal(false);
        fetchNutritionLogs();
        setNewNutritionLog({
          studentId,
          menuId: 0,
          mealDate: new Date().toISOString().split("T")[0],
          completionStatus: "COMPLETED",
        });
      } else {
        Alert.alert("Lỗi", "Không thể ghi nhận bữa ăn");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể ghi nhận bữa ăn");
    }
  };

  const sendMealReminder = async () => {
    if (!token) {
      Alert.alert("Lỗi xác thức", "Bạn cần đăng nhập để gửi nhắc nhở.");
      return;
    }

    try {
      const reminderData = {
        title: "Nhắc nhở bữa ăn",
        content: "Đã đến giờ ăn cho bé!",
        studentId: studentId,
        classroomId: classroomId,
      };

      const success = await authApi.sendMealReminder(token, reminderData);
      if (success) {
        Alert.alert("Thành công", "Đã gửi nhắc nhở bữa ăn!");
      } else {
        Alert.alert("Lỗi", "Không thể gửi nhắc nhở");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể gửi nhắc nhở");
    }
  };

  useEffect(() => {
    fetchHealthInfo();
    fetchGrowthRecords();
    fetchChartData();
    fetchNutritionMenus();
    fetchNutritionLogs();
  }, [studentId, classroomId, selectedHealthCondition]);

  // Giao diện
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8fafd" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <Text style={styles.header}>
                <Ionicons name="heart-circle" size={28} color="#e53935" /> Sức
                khỏe & Dinh dưỡng
              </Text>
              <TouchableOpacity
                style={styles.studentBtn}
                onPress={() => setShowStudentModal(true)}
              >
                <Ionicons name="person-circle" size={22} color="#4DB6AC" />
                <Text style={styles.studentBtnText}>
                  {studentOptions.find((s) => s.id === studentId)?.name ||
                    "Chọn học sinh"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#4DB6AC" />
              </TouchableOpacity>
            </View>

            {/* Health Condition Selector */}
            <View style={styles.card}>
              <Text style={styles.title}>Tình trạng sức khỏe</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {healthConditions.map((condition) => (
                  <TouchableOpacity
                    key={condition.value}
                    style={[
                      styles.conditionBtn,
                      selectedHealthCondition === condition.value &&
                        styles.conditionBtnSelected,
                    ]}
                    onPress={() => setSelectedHealthCondition(condition.value)}
                  >
                    <Text
                      style={[
                        styles.conditionBtnText,
                        selectedHealthCondition === condition.value &&
                          styles.conditionBtnTextSelected,
                      ]}
                    >
                      {condition.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Thông tin sức khỏe tổng quát */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>Thông tin sức khỏe</Text>
                <TouchableOpacity
                  onPress={() => {
                    setEditHealth(
                      healthInfo || { studentId, height: 0, weight: 0 }
                    );
                    setShowEditModal(true);
                  }}
                >
                  <Ionicons name="create-outline" size={22} color="#e53935" />
                </TouchableOpacity>
              </View>
              {loading ? (
                <ActivityIndicator color="#e53935" />
              ) : healthInfo ? (
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Ionicons name="body" size={22} color="#4DB6AC" />
                    <Text style={styles.infoLabel}>Chiều cao</Text>
                    <Text style={styles.infoValue}>{healthInfo.height} cm</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="barbell" size={22} color="#4DB6AC" />
                    <Text style={styles.infoLabel}>Cân nặng</Text>
                    <Text style={styles.infoValue}>{healthInfo.weight} kg</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="analytics" size={22} color="#4DB6AC" />
                    <Text style={styles.infoLabel}>BMI</Text>
                    <Text style={styles.infoValue}>
                      {healthInfo.bmi ?? "?"}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="water" size={22} color="#4DB6AC" />
                    <Text style={styles.infoLabel}>Nhóm máu</Text>
                    <Text style={styles.infoValue}>
                      {healthInfo.bloodType ?? "?"}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.info}>Chưa có dữ liệu</Text>
              )}
              <Text style={styles.info}>
                Dị ứng: {healthInfo?.allergies ?? "Không"}
              </Text>
              <Text style={styles.info}>
                Ghi chú: {healthInfo?.notes ?? "Không"}
              </Text>
            </View>

            {/* Lịch sử tăng trưởng */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>Lịch sử tăng trưởng</Text>
                <TouchableOpacity
                  onPress={() => {
                    setEditGrowth({
                      studentId,
                      date: new Date().toISOString().slice(0, 10),
                      height: 0,
                      weight: 0,
                    });
                    setShowGrowthModal(true);
                  }}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={22}
                    color="#4DB6AC"
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                data={growthRecords}
                keyExtractor={(item) =>
                  item.id ? item.id.toString() : Math.random().toString()
                }
                renderItem={({ item }) => (
                  <View style={styles.growthRow}>
                    <Ionicons
                      name="calendar"
                      size={18}
                      color="#e53935"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.growthDate}>{item.date}</Text>
                    <Text style={styles.growthValue}>
                      {item.height}cm / {item.weight}kg
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setEditGrowth(item);
                        setShowGrowthModal(true);
                      }}
                    >
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color="#4DB6AC"
                      />
                    </TouchableOpacity>
                  </View>
                )}
                ListEmptyComponent={() => (
                  <Text style={styles.info}>Chưa có dữ liệu</Text>
                )}
                scrollEnabled={false}
              />
            </View>

            {/* Biểu đồ tăng trưởng (dạng text đơn giản, có thể tích hợp chart sau) */}
            <View style={styles.card}>
              <Text style={styles.title}>Biểu đồ tăng trưởng</Text>
              {chartData.length === 0 ? (
                <Text style={styles.info}>Chưa có dữ liệu</Text>
              ) : (
                chartData.map((point, idx) => (
                  <View key={idx} style={styles.chartRow}>
                    <Ionicons name="trending-up" size={16} color="#4DB6AC" />
                    <Text style={styles.chartText}>
                      {point.date}: {point.height}cm / {point.weight}kg
                    </Text>
                  </View>
                ))
              )}
            </View>

            {/* Nutrition Menus Section */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>Thực đơn dinh dưỡng</Text>
                <TouchableOpacity onPress={() => setShowMenuModal(true)}>
                  <Ionicons
                    name="restaurant-outline"
                    size={22}
                    color="#4DB6AC"
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                data={nutritionMenus.slice(0, 3)}
                keyExtractor={(item) => item.menuId.toString()}
                renderItem={({ item }) => (
                  <View style={styles.menuItem}>
                    <View style={styles.menuHeader}>
                      <Text style={styles.menuMealType}>{item.mealType}</Text>
                      <Text style={styles.menuCalories}>
                        {item.calories} kcal
                      </Text>
                    </View>
                    <Text style={styles.menuFoods}>{item.foodItems}</Text>
                    <View style={styles.menuNutrition}>
                      <Text style={styles.nutritionItem}>
                        Protein: {item.protein}g
                      </Text>
                      <Text style={styles.nutritionItem}>
                        Carbs: {item.carbs}g
                      </Text>
                      <Text style={styles.nutritionItem}>Fat: {item.fat}g</Text>
                    </View>
                  </View>
                )}
                ListEmptyComponent={() => (
                  <Text style={styles.info}>Chưa có thực đơn</Text>
                )}
                scrollEnabled={false}
              />
              <TouchableOpacity
                style={styles.addMealBtn}
                onPress={() => setShowNutritionModal(true)}
              >
                <Ionicons name="add-circle-outline" size={20} color="#4DB6AC" />
                <Text style={styles.addMealBtnText}>Ghi nhận bữa ăn</Text>
              </TouchableOpacity>
            </View>

            {/* Nutrition Logs Section */}
            <View style={styles.card}>
              <Text style={styles.title}>Lịch sử bữa ăn</Text>
              <FlatList
                data={nutritionLogs
                  .filter((log) => log.studentId === studentId)
                  .slice(0, 5)}
                keyExtractor={(item) => item.logId.toString()}
                renderItem={({ item }) => (
                  <View style={styles.logItem}>
                    <View style={styles.logHeader}>
                      <Text style={styles.logDate}>{item.mealDate}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          item.completionStatus === "COMPLETED"
                            ? styles.statusCompleted
                            : styles.statusIncomplete,
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {item.completionStatus === "COMPLETED"
                            ? "Hoàn thành"
                            : "Chưa hoàn thành"}
                        </Text>
                      </View>
                    </View>
                    {item.notes && (
                      <Text style={styles.logNotes}>{item.notes}</Text>
                    )}
                  </View>
                )}
                ListEmptyComponent={() => (
                  <Text style={styles.info}>Chưa có lịch sử bữa ăn</Text>
                )}
                scrollEnabled={false}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.reminderBtn}
                onPress={handleSendReminder}
              >
                <Ionicons name="notifications" size={20} color="#fff" />
                <Text style={styles.reminderBtnText}>Nhắc nhở sức khỏe</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.reminderBtn, styles.mealReminderBtn]}
                onPress={sendMealReminder}
              >
                <Ionicons name="restaurant" size={20} color="#fff" />
                <Text style={styles.reminderBtnText}>Nhắc nhở bữa ăn</Text>
              </TouchableOpacity>
            </View>

            {/* Nutrition Log Modal */}
            <Modal
              visible={showNutritionModal}
              transparent
              animationType="slide"
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Ghi nhận bữa ăn</Text>

                    <Text style={styles.inputLabel}>Chọn thực đơn:</Text>
                    <TouchableOpacity
                      style={styles.menuSelector}
                      onPress={() => setShowMenuModal(true)}
                    >
                      <Text style={styles.menuSelectorText}>
                        {nutritionMenus.find(
                          (m) => m.menuId === newNutritionLog.menuId
                        )?.foodItems || "Chọn thực đơn..."}
                      </Text>
                      <Ionicons name="chevron-down" size={18} color="#666" />
                    </TouchableOpacity>

                    <Text style={styles.inputLabel}>Ngày:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      value={newNutritionLog.mealDate}
                      onChangeText={(v) =>
                        setNewNutritionLog((prev) => ({ ...prev, mealDate: v }))
                      }
                    />

                    <Text style={styles.inputLabel}>Trạng thái:</Text>
                    <View style={styles.statusSelector}>
                      {["COMPLETED", "PARTIAL", "NOT_STARTED"].map((status) => (
                        <TouchableOpacity
                          key={status}
                          style={[
                            styles.statusOption,
                            newNutritionLog.completionStatus === status &&
                              styles.statusOptionSelected,
                          ]}
                          onPress={() =>
                            setNewNutritionLog((prev) => ({
                              ...prev,
                              completionStatus: status,
                            }))
                          }
                        >
                          <Text
                            style={[
                              styles.statusOptionText,
                              newNutritionLog.completionStatus === status &&
                                styles.statusOptionTextSelected,
                            ]}
                          >
                            {status === "COMPLETED"
                              ? "Hoàn thành"
                              : status === "PARTIAL"
                              ? "Một phần"
                              : "Chưa bắt đầu"}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={styles.inputLabel}>Ghi chú:</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Ghi chú thêm..."
                      multiline
                      value={newNutritionLog.notes || ""}
                      onChangeText={(v) =>
                        setNewNutritionLog((prev) => ({ ...prev, notes: v }))
                      }
                    />

                    <View style={styles.modalActions}>
                      <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => setShowNutritionModal(false)}
                      >
                        <Text style={styles.modalBtnText}>Hủy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.modalBtn, styles.primaryBtn]}
                        onPress={createNutritionLog}
                      >
                        <Text
                          style={[styles.modalBtnText, styles.primaryBtnText]}
                        >
                          Lưu
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            {/* Menu Selection Modal */}
            <Modal visible={showMenuModal} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Chọn thực đơn</Text>
                  <FlatList
                    data={nutritionMenus}
                    keyExtractor={(item) => item.menuId.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.modalItem,
                          newNutritionLog.menuId === item.menuId &&
                            styles.modalItemSelected,
                        ]}
                        onPress={() => {
                          setNewNutritionLog((prev) => ({
                            ...prev,
                            menuId: item.menuId,
                          }));
                          setShowMenuModal(false);
                        }}
                      >
                        <View>
                          <Text style={styles.modalItemTitle}>
                            {item.mealType} - {item.calories} kcal
                          </Text>
                          <Text style={styles.modalItemText}>
                            {item.foodItems}
                          </Text>
                        </View>
                        {newNutritionLog.menuId === item.menuId && (
                          <Ionicons
                            name="checkmark"
                            size={20}
                            color="#4DB6AC"
                          />
                        )}
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setShowMenuModal(false)}
                  >
                    <Text style={styles.modalCloseButtonText}>Đóng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Modal chọn học sinh */}
            <Modal
              visible={showStudentModal}
              transparent
              animationType="slide"
              onRequestClose={() => setShowStudentModal(false)}
            >
              <TouchableWithoutFeedback
                onPress={() => setShowStudentModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Chọn học sinh</Text>
                    <FlatList
                      data={studentOptions}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.modalItem,
                            studentId === item.id && styles.modalItemSelected,
                          ]}
                          onPress={() => {
                            setStudentId(item.id);
                            setShowStudentModal(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.modalItemText,
                              studentId === item.id &&
                                styles.modalItemTextSelected,
                            ]}
                          >
                            {item.name}
                          </Text>
                          {studentId === item.id && (
                            <Ionicons
                              name="checkmark"
                              size={20}
                              color="#4DB6AC"
                            />
                          )}
                        </TouchableOpacity>
                      )}
                    />
                    <TouchableOpacity
                      style={styles.modalCloseButton}
                      onPress={() => setShowStudentModal(false)}
                    >
                      <Text style={styles.modalCloseButtonText}>Đóng</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            {/* Modal chỉnh sửa thông tin sức khỏe */}
            <Modal visible={showEditModal} transparent animationType="slide">
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Cập nhật sức khỏe</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Chiều cao (cm)"
                      keyboardType="numeric"
                      value={editHealth?.height?.toString() ?? ""}
                      onChangeText={(v) =>
                        setEditHealth((h) => h && { ...h, height: Number(v) })
                      }
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Cân nặng (kg)"
                      keyboardType="numeric"
                      value={editHealth?.weight?.toString() ?? ""}
                      onChangeText={(v) =>
                        setEditHealth((h) => h && { ...h, weight: Number(v) })
                      }
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Nhóm máu"
                      value={editHealth?.bloodType ?? ""}
                      onChangeText={(v) =>
                        setEditHealth((h) => h && { ...h, bloodType: v })
                      }
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Dị ứng"
                      value={editHealth?.allergies ?? ""}
                      onChangeText={(v) =>
                        setEditHealth((h) => h && { ...h, allergies: v })
                      }
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Ghi chú"
                      value={editHealth?.notes ?? ""}
                      onChangeText={(v) =>
                        setEditHealth((h) => h && { ...h, notes: v })
                      }
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => setShowEditModal(false)}
                      >
                        <Text style={styles.modalBtnText}>Hủy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={handleSaveHealth}
                      >
                        <Text style={styles.modalBtnText}>Lưu</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            {/* Modal thêm/sửa tăng trưởng */}
            <Modal visible={showGrowthModal} transparent animationType="slide">
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Cập nhật tăng trưởng</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ngày (YYYY-MM-DD)"
                      value={editGrowth?.date ?? ""}
                      onChangeText={(v) =>
                        setEditGrowth((g) => g && { ...g, date: v })
                      }
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Chiều cao (cm)"
                      keyboardType="numeric"
                      value={editGrowth?.height?.toString() ?? ""}
                      onChangeText={(v) =>
                        setEditGrowth((g) => g && { ...g, height: Number(v) })
                      }
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Cân nặng (kg)"
                      keyboardType="numeric"
                      value={editGrowth?.weight?.toString() ?? ""}
                      onChangeText={(v) =>
                        setEditGrowth((g) => g && { ...g, weight: Number(v) })
                      }
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => setShowGrowthModal(false)}
                      >
                        <Text style={styles.modalBtnText}>Hủy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={handleSaveGrowth}
                      >
                        <Text style={styles.modalBtnText}>Lưu</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8fafd", flexGrow: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e53935",
    textAlign: "left",
  },
  studentBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2f1",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  studentBtnText: {
    fontSize: 15,
    color: "#00695C",
    marginHorizontal: 6,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
    shadowColor: "#4DB6AC",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#00695C",
  },
  info: { fontSize: 15, marginBottom: 4, color: "#333" },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoItem: {
    width: "48%",
    backgroundColor: "#e0f2f1",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
    marginBottom: 8,
  },
  infoLabel: { fontSize: 13, color: "#00695C", marginTop: 2 },
  infoValue: { fontSize: 16, fontWeight: "bold", color: "#222", marginTop: 2 },
  growthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 6,
    backgroundColor: "#f8bbd0",
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  growthDate: { fontWeight: "bold", color: "#e53935", marginRight: 10 },
  growthValue: { fontSize: 15, color: "#333", marginRight: 10 },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  chartText: { marginLeft: 6, fontSize: 14, color: "#333" },
  reminderBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e53935",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 30,
    elevation: 2,
  },
  reminderBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: width - 40,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#00695C",
  },
  input: {
    backgroundColor: "#e0f2f1",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
    color: "#222",
  },
  modalBtn: {
    padding: 10,
    marginLeft: 10,
  },
  modalBtnText: {
    color: "#e53935",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemSelected: {
    backgroundColor: "#e0f2f1",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  modalItemTextSelected: {
    color: "#4DB6AC",
    fontWeight: "bold",
  },
  modalCloseButton: {
    marginTop: 16,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },

  // Nutrition styles
  conditionBtn: {
    backgroundColor: "#e0f2f1",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  conditionBtnSelected: {
    backgroundColor: "#4DB6AC",
  },
  conditionBtnText: {
    color: "#00695C",
    fontSize: 14,
    fontWeight: "500",
  },
  conditionBtnTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  menuItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4DB6AC",
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  menuMealType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00695C",
  },
  menuCalories: {
    fontSize: 14,
    color: "#e53935",
    fontWeight: "bold",
  },
  menuFoods: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  menuNutrition: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nutritionItem: {
    fontSize: 12,
    color: "#666",
  },
  addMealBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    padding: 10,
  },
  addMealBtnText: {
    marginLeft: 5,
    color: "#4DB6AC",
    fontWeight: "bold",
  },
  logItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logDate: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: "#4caf50",
  },
  statusIncomplete: {
    backgroundColor: "#ff9800",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  logNotes: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  mealReminderBtn: {
    backgroundColor: "#ff9800",
    flex: 0.48,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    marginTop: 10,
  },
  menuSelector: {
    backgroundColor: "#e0f2f1",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  menuSelectorText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  statusSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statusOption: {
    flex: 1,
    backgroundColor: "#e0f2f1",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 2,
    alignItems: "center",
  },
  statusOptionSelected: {
    backgroundColor: "#4DB6AC",
  },
  statusOptionText: {
    fontSize: 12,
    color: "#00695C",
    textAlign: "center",
  },
  statusOptionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  primaryBtn: {
    backgroundColor: "#4DB6AC",
  },
  primaryBtnText: {
    color: "#fff",
  },
  modalItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },

  // ...existing styles...
});

export default HealthPage;
