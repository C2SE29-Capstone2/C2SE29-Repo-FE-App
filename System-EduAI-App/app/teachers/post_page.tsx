import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Định nghĩa type cho Post
type Post = {
  id: string;
  title: string;
  description: string;
  tag: string;
  image: any;
};

// Placeholder API function (replace with actual API call)
const fetchPosts = async (): Promise<Post[]> => {
  // Simulated API call
  return [
    {
      id: "1",
      title: "Montess",
      description: "Cho bé từ nhỏ đến lớn",
      tag: "Phương pháp Montess",
      image: require("../../assets/images/montess.png"),
    },
    {
      id: "2",
      title: "Ăn uống",
      description: "Cho bé từ 1 đến 3 tuổi",
      tag: "Cách ăn uống",
      image: require("../../assets/images/support1.png"),
    },
    {
      id: "3",
      title: "Montess 2",
      description: "Cho bé từ nhỏ đến lớn",
      tag: "Phương pháp Montess",
      image: require("../../assets/images/montess.png"),
    },
    {
      id: "4",
      title: "Ăn uống 2",
      description: "Cho bé từ 1 đến 3 tuổi",
      tag: "Cách ăn uống",
      image: require("../../assets/images/support1.png"),
    },
  ];
};

// PostItem Component
const PostItem = ({ post }: { post: Post }) => {
  return (
    <TouchableOpacity style={styles.postItem}>
      <View style={styles.postImageContainer}>
        <Text style={styles.postTitle}>{post.title.split(" ")[0]}</Text>
        <Text style={styles.postTitle}>{post.title.split(" ")[1]}</Text>
        <Text style={styles.postDescription}>{post.description}</Text>
      </View>
      <View style={styles.postFooter}>
        <View style={styles.postTag}>
          <Text style={styles.postTagText}>{post.tag}</Text>
        </View>
        <Text style={styles.postDetail}>Xem chi tiết</Text>
      </View>
    </TouchableOpacity>
  );
};

const PostPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await fetchPosts();
        setPosts(postData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noDataText}>Không có dữ liệu</Text>
      </View>
    );
  }

  const pairedPosts: Post[][] = [];
  for (let i = 0; i < posts.length; i += 2) {
    pairedPosts.push(posts.slice(i, i + 2));
  }

  return (
    <ScrollView style={styles.container}>
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
          onPress={() => router.push("/teachers/notification_page")}
        >
          <Ionicons name="notifications-outline" size={25} color="#26A69A" />
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="#26A69A" />
        </TouchableOpacity>
        <Text style={styles.divider}>|</Text>
        <View style={styles.dropdown}>
          <Text style={styles.dropdownText}>Phổ biến</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </View>
        <View style={styles.dropdown}>
          <Text style={styles.dropdownText}>Ngày</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </View>
        <View style={styles.dropdown}>
          <Text style={styles.dropdownText}>Loại</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </View>
      </View>

      <View style={styles.dividerLine} />

      {/* Post List */}
      <FlatList
        data={pairedPosts}
        renderItem={({ item }) => (
          <View style={styles.postRow}>
            <PostItem post={item[0]} />
            {item[1] && <PostItem post={item[1]} />}
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.postList}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 35,
    paddingHorizontal: 20,
  },
  searchContainer: {
    width: 260,
    height: 30,
    backgroundColor: "#E0F2F1",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  searchIcon: { marginLeft: 10 },
  searchInput: {
    color: "#000",
    marginLeft: 5,
    flex: 1,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 20,
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
  postList: { paddingHorizontal: 20, paddingVertical: 10 },
  postRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  postItem: {
    width: (width - 60) / 2, // Adjust for padding and spacing
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  postImageContainer: {
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#f0f0f0", // Placeholder background (since image is not used)
    justifyContent: "center",
    alignItems: "center",
  },
  postTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  postDescription: {
    fontSize: 15,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  postTag: {
    backgroundColor: "#26A69A",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  postTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  postDetail: {
    color: "#2196F3",
    fontSize: 11,
    fontWeight: "500",
  },
  noDataText: { fontSize: 16, color: "#004D40" },
});

export default PostPage;
