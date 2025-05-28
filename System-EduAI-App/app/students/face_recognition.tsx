import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const FaceRecognition = () => {
  const router = useRouter();
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Bạn cần cấp quyền camera để sử dụng chức năng này.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#00bcd4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhận dạng khuôn mặt</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#00bcd4" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Camera area */}
      <View style={styles.cameraArea}>
        <View style={styles.faceCircleContainer}>
          <View style={styles.faceCircle}>
            {/* Camera thực tế trong khung tròn */}
            {imageUri ? (
              <View style={{ width: 204, height: 204, borderRadius: 102, overflow: 'hidden' }}>
                <Image source={{ uri: imageUri }} style={{ width: 204, height: 204, borderRadius: 102 }} />
              </View>
            ) : (
              <TouchableOpacity onPress={openCamera} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="camera" size={48} color="#22C3E6" />
                <Text style={{ color: '#fff', marginTop: 8 }}>Bấm để bật camera</Text>
              </TouchableOpacity>
            )}
            <View style={styles.faceBorder} pointerEvents="none" />
          </View>
        </View>
        <View style={styles.cameraBtnRow}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="bulb-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.scanningBox}>
            <Text style={styles.scanningText}>
              {isScanning ? "Scanning..." : faceDetected ? "Đã phát hiện khuôn mặt!" : "Không phát hiện khuôn mặt"}
            </Text>
          </View>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setIsFrontCamera((prev) => !prev)}>
            <Ionicons name={isFrontCamera ? "camera-reverse-outline" : "camera-outline"} size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        {showCameraOptions && (
          <View style={styles.cameraSwitchBox}>
            <TouchableOpacity style={styles.cameraSwitchBtn}>
              <Ionicons name="camera-reverse-outline" size={28} color="#00bcd4" />
              <Text style={styles.cameraSwitchText}>Đổi camera</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Tips */}
        <View style={styles.tipBox}>
          <View style={styles.tipRow}>
            <Ionicons name="information-circle-outline" size={18} color="#2979ff" style={{ marginRight: 8 }} />
            <Text style={styles.tipTitle}>Mẹo để nhận dạng tốt hơn</Text>
          </View>
          <View style={styles.tipItemRow}>
            <Ionicons name="sunny-outline" size={16} color="#888" style={{ marginRight: 8 }} />
            <Text style={styles.tipItemText}>Đảm bảo ánh sáng tốt trên khuôn mặt của bạn</Text>
          </View>
          <View style={styles.tipItemRow}>
            <Ionicons name="glasses-outline" size={16} color="#888" style={{ marginRight: 8 }} />
            <Text style={styles.tipItemText}>Tháo kính nếu đeo</Text>
          </View>
          <View style={styles.tipItemRow}>
            <Ionicons name="remove-circle-outline" size={16} color="#888" style={{ marginRight: 8 }} />
            <Text style={styles.tipItemText}>Giữ khuôn mặt ngang tầm mắt</Text>
          </View>
        </View>
        {/* Status */}
        <View style={styles.statusBox}>
          <View style={styles.statusHeaderRow}>
            <Text style={styles.statusTitle}>Trạng thái công nhận</Text>
            <View style={styles.statusActive}><Text style={styles.statusActiveText}>Đang hoạt động</Text></View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Phát hiện mặt</Text>
            <Text style={styles.statusSuccess}>Hoàn thành</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Kiểm tra độ sống động</Text>
            <Text style={styles.statusProgress}>Trong tiến trình</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Phát hiện mặt</Text>
            <Text style={styles.statusWait}>Chờ đợi</Text>
          </View>
        </View>
        {/* Recent activity */}
        <View style={styles.sectionFlagRow}>
          <View style={styles.sectionFlag} />
          <Text style={styles.sectionFlagText}>Hoạt động gần đây</Text>
          <View style={styles.yellowDot} />
        </View>
        <View style={styles.activityBox}>
          <View style={styles.activityRow}>
            <Ionicons name="checkmark-circle" size={22} color="#6EE05A" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>Nhận dạng thành công</Text>
              <Text style={styles.activityTime}>Hôm nay, 9:30</Text>
            </View>
          </View>
          <View style={styles.activityRow}>
            <Ionicons name="checkmark-circle" size={22} color="#6EE05A" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>Nhận dạng thành công</Text>
              <Text style={styles.activityTime}>Hôm qua, 14:15</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#00bcd4" },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: "#f44336",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  cameraArea: {
    backgroundColor: "#0B1422",
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  faceCircleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 0,
  },
  faceCircle: {
    width: 210,
    height: 210,
    borderRadius: 105,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: '#0B1422',
  },
  faceBorder: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 3,
    borderColor: "#22C3E6",
    borderStyle: "solid",
  },
  cameraBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#222C3A",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 18,
  },
  scanningBox: {
    backgroundColor: "#222C3A",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  scanningText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  cameraSwitchBox: {
    position: 'absolute',
    right: 24,
    bottom: 60,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraSwitchText: {
    color: '#00bcd4',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
  tipBox: {
    backgroundColor: "#f5fafd",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
    padding: 14,
    elevation: 1,
  },
  tipRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  tipTitle: { color: "#222", fontWeight: "bold", fontSize: 15 },
  tipItemRow: { flexDirection: "row", alignItems: "center", marginBottom: 4, marginLeft: 4 },
  tipItemText: { color: "#888", fontSize: 13 },
  statusBox: {
    backgroundColor: "#f5fafd",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    elevation: 1,
  },
  statusHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  statusTitle: { color: "#222", fontWeight: "bold", fontSize: 15, flex: 1 },
  statusActive: { backgroundColor: "#e0f7fa", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2 },
  statusActiveText: { color: "#00bcd4", fontWeight: "bold", fontSize: 13 },
  statusRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  statusLabel: { color: "#888", fontSize: 14, flex: 1 },
  statusSuccess: { color: "#4caf50", fontWeight: "bold", fontSize: 14 },
  statusProgress: { color: "#2979ff", fontWeight: "bold", fontSize: 14 },
  statusWait: { color: "#bdbdbd", fontWeight: "bold", fontSize: 14 },
  sectionFlagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 4,
    marginHorizontal: 16,
  },
  sectionFlag: {
    width: 120,
    height: 22,
    backgroundColor: "#00bcd4",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionFlagText: { color: "#00bcd4", fontWeight: "bold", fontSize: 15 },
  yellowDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFD600",
    marginLeft: 8,
  },
  activityBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 10,
    elevation: 1,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  activityTitle: { color: "#222", fontWeight: "bold", fontSize: 15 },
  activityTime: { color: "#888", fontSize: 13, marginTop: 2 },
});

export default FaceRecognition;
