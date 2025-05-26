import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const AlbumPage = () => {
  const router = useRouter();
  type ImageItem = { id: string; source: any };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const featuredImages: ImageItem[] = [
    { id: "1", source: require("../../assets/images/album2.png") },
    { id: "2", source: require("../../assets/images/imageinfor.png") },
    { id: "3", source: require("../../assets/images/album1.png") },
  ];

  const otherImages: ImageItem[][] = [
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            />
          </View>
          <TouchableOpacity
            onPress={() => router.push("/teachers/notification_page" )}
          >
            <Ionicons name="notifications-outline" size={25} color="#4DB6AC" />
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
            <Image source={item.source} style={styles.featuredImage} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.featuredImageList}
        />

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
            <Image source={pair[0].source} style={styles.otherImage} />
            <Image source={pair[1].source} style={styles.otherImage} />
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/addPicture" as never)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
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
    height: 25,
    backgroundColor: "#fff",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
});

export default AlbumPage;
