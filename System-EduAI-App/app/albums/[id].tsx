import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Alert,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Định nghĩa kiểu dữ liệu Album theo API
type Album = {
  albumId: number;
  albumName: string;
  description?: string;
  classroomId?: number;
  activityId?: number;
  imageUrls?: string; // API trả về chuỗi URL phân tách bằng dấu phẩy
  createdDate?: string;
};

const AlbumDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbumDetail = async () => {
      try {
        const albumId = Array.isArray(id)
          ? parseInt(id[0])
          : parseInt(id as string);
        if (isNaN(albumId)) {
          console.error("Invalid album ID");
          setLoading(false);
          return;
        }

        const data = await authApi.getAlbumById(albumId, token || undefined);
        if (data) {
          setAlbum(data);

          // Chuyển đổi chuỗi URL thành mảng
          if (data.imageUrls) {
            const urlArray = data.imageUrls.split(",").map((url) => url.trim());
            setImages(urlArray);
          }
        }
      } catch (error) {
        console.error("Failed to fetch album detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetail();
  }, [id, token]);

  const handleDeleteAlbum = () => {
    if (!token) {
      Alert.alert("Lỗi", "Bạn cần đăng nhập để thực hiện chức năng này");
      return;
    }

    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa album này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const albumId = Array.isArray(id)
              ? parseInt(id[0])
              : parseInt(id as string);
            const success = await authApi.deleteAlbum(token, albumId);

            if (success) {
              Alert.alert("Thành công", "Đã xóa album");
              router.back();
            } else {
              Alert.alert("Lỗi", "Không thể xóa album");
            }
          } catch (error) {
            console.error("Delete album error:", error);
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi xóa album");
          }
        },
      },
    ]);
  };

  const handleShare = async () => {
    if (!album) return;

    try {
      await Share.share({
        message: `Xem album "${album.albumName}" - ${album.description || ""}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  if (!album) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Không tìm thấy album hoặc đã có lỗi xảy ra
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{album.albumName}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteAlbum}
            style={styles.headerButton}
          >
            <Ionicons name="trash-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Album Info Card */}
        <View style={styles.albumInfoCard}>
          <Text style={styles.albumTitle}>{album.albumName}</Text>
          {album.description && (
            <Text style={styles.albumDescription}>{album.description}</Text>
          )}
          <View style={styles.metadataContainer}>
            <View style={styles.metadataItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.metadataText}>
                {album.createdDate || "Không xác định"}
              </Text>
            </View>
            {album.classroomId && (
              <View style={styles.metadataItem}>
                <Ionicons name="school-outline" size={16} color="#666" />
                <Text style={styles.metadataText}>Lớp {album.classroomId}</Text>
              </View>
            )}
            {album.activityId && (
              <View style={styles.metadataItem}>
                <Ionicons name="flag-outline" size={16} color="#666" />
                <Text style={styles.metadataText}>
                  Hoạt động {album.activityId}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Gallery Section */}
        <View style={styles.gallerySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hình ảnh</Text>
            <Text style={styles.imageCount}>{images.length} ảnh</Text>
          </View>

          {images.length > 0 ? (
            <FlatList
              data={images}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.imageContainer}
                  onPress={() => handleImagePress(item)}
                >
                  <Image
                    source={{ uri: item }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.noImagesContainer}>
              <Ionicons name="images-outline" size={48} color="#ccc" />
              <Text style={styles.noImagesText}>Không có hình ảnh nào</Text>
            </View>
          )}
        </View>

        {/* Edit Button - Only for teachers */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            router.push({
              pathname: "/albums/edit",
              params: { id: album.albumId },
            } as any)
          }
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Chỉnh sửa album</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Full screen image viewer */}
      {selectedImage && (
        <View style={styles.imageViewerOverlay}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const imageSize = (width - 48) / 2; // 2 hình ảnh mỗi hàng, margin 16px mỗi bên

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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#f44336",
    textAlign: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4DB6AC",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: "row",
  },
  backButtonText: {
    color: "#4DB6AC",
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  albumInfoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  albumTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  albumDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
    lineHeight: 22,
  },
  metadataContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  metadataText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  gallerySection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  imageCount: {
    fontSize: 14,
    color: "#888",
  },
  imageContainer: {
    margin: 4,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: imageSize,
    height: imageSize,
  },
  noImagesContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  noImagesText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 12,
  },
  editButton: {
    backgroundColor: "#4DB6AC",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  imageViewerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  fullScreenImage: {
    width: width,
    height: height - 100,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1001,
  },
});

export default AlbumDetailScreen;
