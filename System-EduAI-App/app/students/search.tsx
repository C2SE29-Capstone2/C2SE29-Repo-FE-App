import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const mockData = [
  "Nguyễn Văn A",
  "Trần Thị B",
  "Lê Văn C",
  "Phạm Thị D",
  "Võ Văn E",
  "Lê Trần Ninh",
  "Võ Văn Mạnh",
];

const SearchScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const results = mockData.filter((name) =>
    name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#00bcd4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tìm kiếm</Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={22} color="#00bcd4" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Nhập tên học sinh..."
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <ScrollView style={{ flex: 1 }}>
        {results.length === 0 ? (
          <Text style={styles.noResult}>Không tìm thấy kết quả</Text>
        ) : (
          results.map((name, idx) => (
            <View key={idx} style={styles.resultItem}>
              <Ionicons name="person" size={22} color="#00bcd4" style={{ marginRight: 10 }} />
              <Text style={styles.resultText}>{name}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5fafd" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#00bcd4" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#222",
  },
  noResult: {
    color: "#888",
    fontSize: 15,
    textAlign: "center",
    marginTop: 30,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    elevation: 1,
  },
  resultText: { fontSize: 15, color: "#222" },
});

export default SearchScreen;
