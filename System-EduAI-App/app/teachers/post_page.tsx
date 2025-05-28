import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Post {
  id: string;
  image: any;
  title: string;
  subtitle: string;
  tag: string;
}

const PostPage = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPosts([
        {
          id: "1",
          image: require("../../assets/images/montess.png"),
          title: "Montess",
          subtitle: "Cho bé từ nhỏ đến lớn",
          tag: "Phương pháp Montess",
        },
        {
          id: "2",
          image: require("../../assets/images/support1.png"),
          title: "Ăn uống",
          subtitle: "Cho bé từ 1 đến 3 tuổi",
          tag: "Cách ăn uống",
        },
        {
          id: "3",
          image: require("../../assets/images/montess.png"),
          title: "Montess",
          subtitle: "Cho bé từ nhỏ đến lớn",
          tag: "Phương pháp Montess",
        },
        {
          id: "4",
          image: require("../../assets/images/support1.png"),
          title: "Dinh dưỡng",
          subtitle: "Cho bé từ 2 đến 4 tuổi",
          tag: "Dinh dưỡng",
        },
      ]);
      setIsLoading(false);
    }, 1000);
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
        <Text style={styles.noDataText}>Không có bài viết nào</Text>
      </View>
    );
  }

  const pairedPosts: Post[][] = [];
  for (let i = 0; i < posts.length; i += 2) {
    pairedPosts.push(posts.slice(i, i + 2));
  }

  const renderPostPair = ({ item }: { item: Post[] }) => (
    <View style={styles.postRow}>
      {item.map((post) => (
        <TouchableOpacity
          key={post.id}
          style={styles.postCard}
          onPress={() => {
            // Handle post tap
            console.log("Post tapped:", post.title);
          }}
        >
          <Image source={post.image} style={styles.postImage} />
          <View style={styles.postContent}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postSubtitle}>{post.subtitle}</Text>
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{post.tag}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

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
      </View>

      <View style={styles.dividerLine} />

      {/* Posts List */}
      <FlatList
        data={pairedPosts}
        renderItem={renderPostPair}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.postList}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  noDataText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: "#4DB6AC",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    marginTop: 50,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginHorizontal: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  divider: {
    marginHorizontal: 12,
    fontSize: 16,
    color: "#ccc",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  dropdownText: {
    fontSize: 14,
    color: "#000",
    marginRight: 4,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
  },
  postList: {
    padding: 16,
  },
  postRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  postCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  postContent: {
    padding: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  postSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  tagContainer: {
    backgroundColor: "#26A69A",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  tagText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PostPage;
