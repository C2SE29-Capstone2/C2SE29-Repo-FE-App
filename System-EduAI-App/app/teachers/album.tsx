import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { authApi, publicApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Cập nhật type Album để khớp với API response
type Album = {
  albumId: number;
  albumName: string;
  description?: string;
  classroomId?: number;
  activityId?: number;
  imageUrls?: string; // API trả về chuỗi URL phân tách bằng dấu phẩy
  createdDate?: string;
};

const AlbumPage = () => {
  const router = useRouter();
  const { token } = useAuth();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchText, setSearchText] = useState("");
  const [classroomId, setClassroomId] = useState<number>(1); // Assuming default classroom

  // Thêm state cho refresh
  const [refreshing, setRefreshing] = useState(false);

  // Nâng cấp: Thêm chọn classroom (giả lập)
  const classroomOptions = [
    { id: 1, name: "Lớp Mầm - 3 tuổi" },
    { id: 2, name: "Lớp Chồi - 4 tuổi" },
    { id: 3, name: "Lớp Lá - 5 tuổi" },
  ];
  const [showClassroomModal, setShowClassroomModal] = useState(false);

  const featuredImages: { id: string; source: any; albumId?: number }[] = [
    { id: "1", source: require("../../assets/images/album2.png") },
    { id: "2", source: require("../../assets/images/imageinfor.png") },
    { id: "3", source: require("../../assets/images/album1.png") },
  ];

  const otherImages: { id: string; source: any; albumId?: number }[][] = [
    [
      { id: "1", source: require("../../assets/images/summerAlbum1.png") },
      { id: "2", source: require("../../assets/images/summerAlbum2.png") },
    ],
    [
      { id: "3", source: require("../../assets/images/summerAlbum3.png") },
      { id: "4", source: require("../../assets/images/summerAlbum4.png") },
    ],
    [
      { id: "5", source: require("../../assets/images/summerAlbum1.png") },
      { id: "6", source: require("../../assets/images/summerAlbum2.png") },
    ],
  ];

  useEffect(() => {
    fetchAlbums();
  }, [classroomId]);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      // Test connection first - 404 cũng có nghĩa là server đang chạy
      const isConnected = await publicApi.testConnection();
      if (!isConnected) {
        Alert.alert(
          "Lỗi kết nối",
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền mạng."
        );
        setAlbums([]);
        return;
      }

      // Pass token for authenticated request
      const albumData = await authApi.getAlbumsByClassroom(
        classroomId,
        token || undefined
      );

      if (Array.isArray(albumData)) {
        console.log("Album data fetched successfully:", albumData);
        setAlbums(albumData);
      } else {
        console.warn("Album data is not an array:", albumData);
        setAlbums([]);
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      Alert.alert(
        "Lỗi",
        "Không thể tải danh sách album. Vui lòng kiểm tra kết nối mạng."
      );
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  // Sửa lại nút tạo album để chuyển đến màn hình tạo album mới
  const handleCreateAlbum = () => {
    if (!token) {
      Alert.alert("Lỗi", "Không tìm thấy token đăng nhập!");
      return;
    }
    router.push("/albums/create" as any);
  };

  const handleDeleteAlbum = async (albumId: number) => {
    if (!token) {
      Alert.alert("Lỗi", "Không tìm thấy token đăng nhập!");
      return;
    }

    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa album này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const result = await authApi.deleteAlbum(token, albumId);
            if (result) {
              Alert.alert("Thành công", "Xóa album thành công!");
              fetchAlbums(); // Refresh list
            } else {
              Alert.alert("Lỗi", "Xóa album thất bại!");
            }
          } catch (error) {
            console.error("Error deleting album:", error);
            Alert.alert("Lỗi", "Không thể xóa album");
          }
        },
      },
    ]);
  };

  // Sửa hàm xử lý khi bấm vào ảnh
  const handleImagePress = async (albumId: number) => {
    try {
      setLoading(true);

      // Kiểm tra kết nối trước khi điều hướng
      const isConnected = await publicApi.testConnection();
      if (!isConnected) {
        Alert.alert(
          "Lỗi kết nối",
          "Không thể tải chi tiết album. Backend đang offline, sử dụng mock mode."
        );
        // Show mock album detail instead of navigating
        Alert.alert("Mock Album", `Xem album ${albumId} - Tính năng đang phát triển`);
        return;
      }

      // Kiểm tra album có tồn tại không trước khi điều hướng
      const albumDetail = await authApi.getAlbumById(albumId, token);
      if (!albumDetail) {
        Alert.alert(
          "Lỗi",
          "Không tìm thấy album hoặc đã xảy ra lỗi khi tải dữ liệu."
        );
        return;
      }

      // Điều hướng đến chi tiết album
      router.push(`/albums/${albumId}` as any);
    } catch (error) {
      console.error("Error navigating to album:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi mở album. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeaturedImagePress = async (imageId: string) => {
    try {
      const isConnected = await publicApi.testConnection();
      if (!isConnected) {
        Alert.alert(
          "Lỗi kết nối",
          "Không thể tải ảnh. Vui lòng kiểm tra kết nối mạng."
        );
        return;
      }

      // Tạo modal để hiển thị ảnh lớn thay vì điều hướng
      Alert.alert(
        "Xem ảnh",
        "Tính năng xem ảnh chi tiết sẽ được triển khai trong phiên bản tiếp theo.",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải ảnh này.");
    }
  };

  // Safe filter with fallback
  const filteredAlbums = Array.isArray(albums)
    ? albums.filter((album) => {
        // Cập nhật để sử dụng albumName thay vì title
        const albumName = album?.albumName || "";
        const searchTerm = searchText || "";
        return albumName.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];

  // Hàm chuyển đổi chuỗi URL thành mảng URL
  const getImageUrlsArray = (imageUrlsString?: string): string[] => {
    if (!imageUrlsString) return [];
    return imageUrlsString.split(",").map((url) => url.trim());
  };

  // Hàm làm mới khi kéo xuống
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlbums();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[{}]} // Dummy data to render all content in renderItem
        keyExtractor={() => "main"}
        renderItem={() => (
          <View>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={25} color="#000" />
              </TouchableOpacity>
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search-outline"
                  size={20}
                  color="#000"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm Kiếm"
                  placeholderTextColor="#000"
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>
              <TouchableOpacity
                onPress={() => router.push("/teachers/notification_page")}
              >
                <Ionicons
                  name="notifications-outline"
                  size={25}
                  color="#4DB6AC"
                />
              </TouchableOpacity>
            </View>

            {/* Nâng cấp: Chọn classroom */}
            <View style={{ marginVertical: 10 }}>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowClassroomModal(true)}
              >
                <Ionicons name="school-outline" size={18} color="#4DB6AC" />
                <Text style={{ marginLeft: 8, fontSize: 15 }}>
                  {classroomOptions.find((c) => c.id === classroomId)?.name ||
                    "Chọn lớp"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#333"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>

            {/* Date Filters */}
            <View style={styles.dateFilterContainer}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={24} color="#4DB6AC" />
              </TouchableOpacity>
              <Text style={styles.divider}>|</Text>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>
                  {selectedDate ? selectedDate.getDate() : "Ngày"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#000" />
              </View>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>
                  {selectedDate ? selectedDate.getMonth() + 1 : "Tháng"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#000" />
              </View>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>
                  {selectedDate ? selectedDate.getFullYear() : "Năm"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#000" />
              </View>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="default"
                onChange={(_: any, date?: Date) => {
                  setShowDatePicker(false);
                  if (date) setSelectedDate(date);
                }}
              />
            )}

            <View style={styles.dividerLine} />

            {loading ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color="#4DB6AC" />
              </View>
            ) : (
              <>
                {/* Featured Section */}
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionLabel}>
                    <Text style={styles.sectionLabelText}>Nổi Bật</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.seeAll}>Xem tất cả</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={featuredImages}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleFeaturedImagePress(item.id)}
                    >
                      <Image
                        source={item.source}
                        style={styles.featuredImage}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.featuredImageList}
                  scrollEnabled
                />

                {/* Backend Albums Section */}
                {filteredAlbums.length > 0 && (
                  <>
                    <View style={styles.sectionHeader}>
                      <View style={styles.sectionLabel}>
                        <Text style={styles.sectionLabelText}>
                          Albums từ Server
                        </Text>
                      </View>
                      <TouchableOpacity onPress={fetchAlbums}>
                        <Text style={styles.seeAll}>Làm mới</Text>
                      </TouchableOpacity>
                    </View>

                    <FlatList
                      data={filteredAlbums}
                      renderItem={({ item }) => {
                        // Chuyển đổi chuỗi URL thành mảng để hiển thị ảnh đầu tiên
                        const imageUrls = getImageUrlsArray(item.imageUrls);
                        const firstImage =
                          imageUrls.length > 0 ? imageUrls[0] : null;

                        return (
                          <View style={styles.albumItem}>
                            <View style={styles.albumHeader}>
                              <Text style={styles.albumTitle}>
                                {item.albumName}
                              </Text>
                              <Text style={styles.albumDate}>
                                {item.createdDate}
                              </Text>
                            </View>

                            {item.description && (
                              <Text style={styles.albumDescription}>
                                {item.description}
                              </Text>
                            )}

                            {firstImage && (
                              <Image
                                source={{ uri: firstImage }}
                                style={styles.albumPreviewImage}
                                resizeMode="cover"
                              />
                            )}

                            <View style={styles.albumActions}>
                              <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleImagePress(item.albumId)}
                              >
                                <Text style={styles.actionButtonText}>Xem</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[
                                  styles.actionButton,
                                  styles.deleteButton,
                                ]}
                                onPress={() => handleDeleteAlbum(item.albumId)}
                              >
                                <Text
                                  style={[
                                    styles.actionButtonText,
                                    styles.deleteButtonText,
                                  ]}
                                >
                                  Xóa
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      }}
                      keyExtractor={(item) =>
                        item.albumId?.toString() || Math.random().toString()
                      }
                      scrollEnabled={false}
                    />
                  </>
                )}

                {/* Other Section */}
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionLabel}>
                    <Text style={styles.sectionLabelText}>Khác</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.seeAll}>Xem tất cả</Text>
                  </TouchableOpacity>
                </View>

                {otherImages.map((pair, index) => (
                  <View key={index} style={styles.otherImageRow}>
                    <TouchableOpacity
                      onPress={() => handleFeaturedImagePress(pair[0].id)}
                    >
                      <Image
                        source={pair[0].source}
                        style={styles.otherImage}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleFeaturedImagePress(pair[1].id)}
                    >
                      <Image
                        source={pair[1].source}
                        style={styles.otherImage}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
            {/* Floating Action Button */}
            <TouchableOpacity
              style={styles.fab}
              onPress={handleCreateAlbum}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Modal chọn lớp */}
            <Modal
              visible={showClassroomModal}
              transparent
              animationType="slide"
              onRequestClose={() => setShowClassroomModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Chọn lớp học</Text>
                  <FlatList
                    data={classroomOptions}
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
                            classroomId === item.id &&
                              styles.modalItemTextSelected,
                          ]}
                        >
                          {item.name}
                        </Text>
                        {classroomId === item.id && (
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
                    onPress={() => setShowClassroomModal(false)}
                  >
                    <Text style={styles.modalCloseButtonText}>Đóng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      />
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingTop: 35, paddingHorizontal: 20, paddingBottom: 30 },
  header: { flexDirection: "row", alignItems: "center" },
  searchContainer: {
    width: 260,
    height: 40,
    backgroundColor: "#E0F2F1",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  searchIcon: { marginLeft: 10 },
  searchInput: { color: "#000", marginLeft: 5, flex: 1 },
  dateFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    marginTop: 10,
  },
  divider: { fontSize: 20, marginHorizontal: 10 },
  dropdown: {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    marginHorizontal: 5,
  },
  dropdownText: { fontSize: 15 },
  dividerLine: { height: 1, backgroundColor: "#000", marginVertical: 10 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  sectionLabel: {
    height: 30,
    backgroundColor: "#4DB6AC",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  sectionLabelText: { color: "#fff", fontWeight: "600" },
  seeAll: {
    fontSize: 13,
    color: "#4FC3F7",
    fontWeight: "bold",
    marginLeft: "auto",
  },
  featuredImageList: { paddingVertical: 10 },
  featuredImage: { width: 160, height: 170, borderRadius: 10, marginRight: 15 },
  otherImageRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 5,
  },
  otherImage: { width: 160, height: 190, borderRadius: 10 },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#00695C",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  albumItem: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  albumHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  albumDate: {
    fontSize: 12,
    color: "#666",
  },
  albumDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  albumPreviewImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginVertical: 10,
  },
  albumActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "#4DB6AC",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  deleteButtonText: {
    color: "#fff",
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

export default AlbumPage;
