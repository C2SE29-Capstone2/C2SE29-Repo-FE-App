import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  FlatList,
  PermissionsAndroid,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dsdkxr02x/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "my_upload_preset"; // Đúng tên preset unsigned bạn đã tạo trên Cloudinary

const CreateAlbumScreen = () => {
  const router = useRouter();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classroomId, setClassroomId] = useState<number | null>(null);
  const [activityId, setActivityId] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // For custom dropdown
  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  useEffect(() => {
    // Kiểm tra quyền truy cập thư viện ảnh
    (async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Quyền truy cập ảnh",
            message: "Ứng dụng cần quyền truy cập ảnh để chọn hình.",
            buttonNeutral: "Hỏi lại sau",
            buttonNegative: "Hủy",
            buttonPositive: "Đồng ý",
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Lỗi", "Bạn cần cấp quyền truy cập ảnh!");
        }
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Lỗi", "Bạn cần cấp quyền truy cập ảnh!");
        }
      }
    })();

    // Tải danh sách lớp học và hoạt động (đây là mẫu, thay thế bằng API thực tế)
    setClassrooms([
      { id: 1, name: "Lớp Mầm - 3 tuổi" },
      { id: 2, name: "Lớp Chồi - 4 tuổi" },
      { id: 3, name: "Lớp Lá - 5 tuổi" },
    ]);

    setActivities([
      { id: 1, name: "Học Piano" },
      { id: 2, name: "Vẽ tranh" },
      { id: 10, name: "Lễ hội văn hóa" },
    ]);
  }, []);

  // Sửa lại hàm uploadImageToCloudinary theo tài liệu Cloudinary React Native
  const uploadImageToCloudinary = async (
    uri: string
  ): Promise<string | null> => {
    try {
      // Lấy tên file từ uri
      const fileName = uri.split("/").pop() || `photo_${Date.now()}.jpg`;
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: fileName,
      } as any);
      // Thay YOUR_UPLOAD_PRESET bằng preset thật bạn tạo trên Cloudinary dashboard (unsigned)
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      // Cloudinary yêu cầu không set Content-Type, để fetch tự động set multipart/form-data boundary
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dsdkxr02x/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      }
      console.error("Cloudinary upload error:", data);
      return null;
    } catch (error) {
      console.error("Upload image error:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      Alert.alert("Lỗi", "Bạn cần đăng nhập để tạo album");
      return;
    }
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên album");
      return;
    }
    if (!classroomId) {
      Alert.alert("Lỗi", "Bạn phải chọn lớp học!");
      return;
    }
    setSubmitting(true);
    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        for (const uri of images) {
          const url = await uploadImageToCloudinary(uri);
          if (url) imageUrls.push(url);
        }
      }
      const albumData = {
        title: title.trim(),
        description: description.trim(),
        classroomId: classroomId,
        activityId: activityId,
        images: imageUrls,
      };
      const result = await authApi.createAlbum(token, albumData);
      if (result) {
        Alert.alert("Thành công", "Album đã được tạo thành công!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert(
          "Lỗi",
          "Không thể tạo album. Có thể bạn không có quyền quản lý lớp học này hoặc hoạt động không thuộc lớp học này.\nVui lòng kiểm tra lại quyền hoặc liên hệ quản trị viên."
        );
      }
    } catch (error: any) {
      let message = "Đã xảy ra lỗi khi tạo album.";
      if (error && typeof error === "object" && error.message) {
        message = error.message;
      }
      Alert.alert("Lỗi", message);
    } finally {
      setSubmitting(false);
    }
  };

  const pickImages = async () => {
    try {
      // Sử dụng ImagePicker.MediaTypeOptions.Images để tránh lỗi undefined
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        quality: 0.8,
      });
      if (!result.canceled) {
        const assets = (result.assets || result.selected) ?? [];
        const newImageUris = assets.map((asset: any) => asset.uri);
        setImages([...images, ...newImageUris]);
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo Album Mới</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Form fields */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Tên Album <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên album"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Mô tả</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Mô tả về album"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Custom Classroom Dropdown */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Lớp học</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowClassroomModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownButtonText}>
              {classroomId
                ? classrooms.find((c) => c.id === classroomId)?.name
                : "Chọn lớp học"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Custom Activity Dropdown */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Hoạt động</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowActivityModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownButtonText}>
              {activityId
                ? activities.find((a) => a.id === activityId)?.name
                : "Chọn hoạt động"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Image picker */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Hình ảnh</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={pickImages}
            activeOpacity={0.7}
          >
            <Ionicons name="images-outline" size={24} color="#4DB6AC" />
            <Text style={styles.imagePickerText}>Chọn ảnh từ thư viện</Text>
          </TouchableOpacity>

          {/* Preview selected images */}
          {images.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imagePreviewWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#f44336" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Submit button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!title.trim() || submitting) && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={!title.trim() || submitting}
          activeOpacity={0.7}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Tạo Album</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Classroom Selection Modal */}
      <Modal
        visible={showClassroomModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowClassroomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn lớp học</Text>
            <FlatList
              data={classrooms}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    classroomId === item.id && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    setClassroomId(item.id);
                    setShowClassroomModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      classroomId === item.id && styles.modalItemTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {classroomId === item.id && (
                    <Ionicons name="checkmark" size={20} color="#4DB6AC" />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowClassroomModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCloseButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Activity Selection Modal */}
      <Modal
        visible={showActivityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowActivityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn hoạt động</Text>
            <FlatList
              data={activities}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    activityId === item.id && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    setActivityId(item.id);
                    setShowActivityModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      activityId === item.id && styles.modalItemTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {activityId === item.id && (
                    <Ionicons name="checkmark" size={20} color="#4DB6AC" />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowActivityModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCloseButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4DB6AC",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  backButton: {
    padding: 8,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  required: {
    color: "#f44336",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dropdownButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
  },
  imagePicker: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#4DB6AC",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  imagePreviewWrapper: {
    width: 100,
    height: 100,
    margin: 4,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  submitButton: {
    backgroundColor: "#4DB6AC",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxHeight: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
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
});

export default CreateAlbumScreen;
