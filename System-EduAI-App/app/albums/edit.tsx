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
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";

type Classroom = {
  id: number;
  name: string;
};

type Activity = {
  id: number;
  name: string;
};

const EditAlbumScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classroomId, setClassroomId] = useState<number | null>(null);
  const [activityId, setActivityId] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // For custom dropdown
  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  useEffect(() => {
    // Mẫu data lớp học và hoạt động
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

    // Lấy dữ liệu album hiện tại
    const fetchAlbumData = async () => {
      try {
        const albumId = Array.isArray(id)
          ? parseInt(id[0])
          : parseInt(id as string);
        if (isNaN(albumId)) {
          Alert.alert("Lỗi", "ID album không hợp lệ");
          router.back();
          return;
        }

        const albumData = await authApi.getAlbumById(
          albumId,
          token || undefined
        );
        if (albumData) {
          setTitle(albumData.albumName || "");
          setDescription(albumData.description || "");
          setClassroomId(albumData.classroomId || null);
          setActivityId(albumData.activityId || null);

          // Chuyển đổi chuỗi URL thành mảng
          if (albumData.imageUrls) {
            const urlArray = albumData.imageUrls
              .split(",")
              .map((url) => url.trim());
            setImages(urlArray);
          }
        } else {
          Alert.alert("Lỗi", "Không thể tải thông tin album");
        }
      } catch (error) {
        console.error("Error fetching album data:", error);
        Alert.alert("Lỗi", "Đã xảy ra lỗi khi tải dữ liệu album");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [id, token]);

  const pickImages = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImageUris = result.assets.map((asset) => asset.uri);
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

  const handleUpdate = async () => {
    if (!token) {
      Alert.alert("Lỗi", "Bạn cần đăng nhập để cập nhật album");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên album");
      return;
    }

    const albumId = Array.isArray(id)
      ? parseInt(id[0])
      : parseInt(id as string);
    if (isNaN(albumId)) {
      Alert.alert("Lỗi", "ID album không hợp lệ");
      return;
    }

    setSubmitting(true);
    try {
      // Trong môi trường thực tế, bạn sẽ cần upload ảnh mới lên server
      const albumData = {
        title: title.trim(),
        description: description.trim(),
        classroomId: classroomId,
        activityId: activityId,
        images: images, // Trong API thực tế, đây là các URL đã upload
      };

      const result = await authApi.updateAlbum(token, albumId, albumData);

      if (result) {
        Alert.alert("Thành công", "Album đã được cập nhật thành công!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Lỗi", "Không thể cập nhật album. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error updating album:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi cập nhật album.");
    } finally {
      setSubmitting(false);
    }
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
        <Text style={styles.headerTitle}>Chỉnh Sửa Album</Text>
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
          >
            <Text style={styles.dropdownButtonText}>
              {activityId
                ? activities.find((a) => a.id === activityId)?.name
                : "Chọn hoạt động"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Image management */}
        <View style={styles.formGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Hình ảnh</Text>
            <Text style={styles.imageCount}>{images.length} ảnh</Text>
          </View>

          {/* Current images */}
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

          {/* Add more images button */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
            <Ionicons name="add-circle-outline" size={24} color="#4DB6AC" />
            <Text style={styles.imagePickerText}>Thêm ảnh mới</Text>
          </TouchableOpacity>
        </View>

        {/* Update button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!title.trim() || submitting) && styles.disabledButton,
          ]}
          onPress={handleUpdate}
          disabled={!title.trim() || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Cập Nhật Album</Text>
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
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  imageCount: {
    fontSize: 14,
    color: "#666",
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
  pickerContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
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
    marginBottom: 16,
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

export default EditAlbumScreen;
