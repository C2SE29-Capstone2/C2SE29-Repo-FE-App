import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams, Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Placeholder API function (replace with actual API call)
const fetchCommentsForChild = async (childId: string) => {
  return [
    {
      id: "mam-1",
      postMonth: "1",
      comment: "Bé rất ngoan và hòa đồng với các bạn.",
    },
    {
      id: "mam-2",
      postMonth: "2",
      comment: "Bé tích cực tham gia các hoạt động lớp.",
    },
    {
      id: "mam-3",
      postMonth: "3",
      comment: "Bé biết tự dọn dẹp đồ chơi sau khi chơi.",
    },
    {
      id: "mam-4",
      postMonth: "4",
      comment: "Bé chủ động phát biểu trong giờ học.",
    },
    {
      id: "mam-5",
      postMonth: "5",
      comment: "Bé biết giúp đỡ bạn bè khi cần thiết.",
    },
    { id: "mam-6", postMonth: "6", comment: "Bé thích vẽ tranh và kể chuyện." },
    {
      id: "mam-7",
      postMonth: "7",
      comment: "Bé tự tin khi tham gia văn nghệ.",
    },
    {
      id: "mam-8",
      postMonth: "8",
      comment: "Bé biết giữ gìn vệ sinh cá nhân.",
    },
    {
      id: "mam-9",
      postMonth: "9",
      comment: "Bé tiến bộ rõ rệt trong giao tiếp.",
    },
    {
      id: "mam-10",
      postMonth: "10",
      comment: "Bé tham gia tốt các hoạt động ngoài trời.",
    },
    {
      id: "mam-11",
      postMonth: "11",
      comment: "Bé biết tự chăm sóc bản thân khi cần thiết.",
    },
    {
      id: "mam-12",
      postMonth: "12",
      comment: "Bé rất lễ phép với thầy cô và bạn bè.",
    },

    { id: "choi-1", postMonth: "1", comment: "Bé chủ động giúp đỡ bạn bè." },
    {
      id: "choi-2",
      postMonth: "2",
      comment: "Bé biết tự dọn dẹp đồ chơi sau khi chơi.",
    },
    { id: "choi-3", postMonth: "3", comment: "Bé phát âm rõ ràng hơn." },
    {
      id: "choi-4",
      postMonth: "4",
      comment: "Bé thích tham gia các trò chơi vận động.",
    },
    {
      id: "choi-5",
      postMonth: "5",
      comment: "Bé biết chia sẻ đồ chơi với bạn.",
    },
    {
      id: "choi-6",
      postMonth: "6",
      comment: "Bé tự tin khi trả lời câu hỏi của cô.",
    },
    {
      id: "choi-7",
      postMonth: "7",
      comment: "Bé biết nhận biết màu sắc và hình khối.",
    },
    {
      id: "choi-8",
      postMonth: "8",
      comment: "Bé tham gia tốt các hoạt động nhóm.",
    },
    {
      id: "choi-9",
      postMonth: "9",
      comment: "Bé biết kể lại câu chuyện ngắn.",
    },
    { id: "choi-10", postMonth: "10", comment: "Bé biết tự mặc quần áo." },
    {
      id: "choi-11",
      postMonth: "11",
      comment: "Bé biết nhận biết các con vật quen thuộc.",
    },
    {
      id: "choi-12",
      postMonth: "12",
      comment: "Bé tiến bộ về kỹ năng giao tiếp.",
    },

    {
      id: "la-1",
      postMonth: "1",
      comment: "Bé biết tự chuẩn bị đồ dùng học tập.",
    },
    { id: "la-2", postMonth: "2", comment: "Bé biết nhận biết các chữ cái." },
    {
      id: "la-3",
      postMonth: "3",
      comment: "Bé biết đếm số và nhận biết số lượng.",
    },
    { id: "la-4", postMonth: "4", comment: "Bé biết kể chuyện theo tranh." },
    {
      id: "la-5",
      postMonth: "5",
      comment: "Bé biết tự chăm sóc bản thân khi cần thiết.",
    },
    {
      id: "la-6",
      postMonth: "6",
      comment: "Bé biết hợp tác với bạn trong các hoạt động nhóm.",
    },
    {
      id: "la-7",
      postMonth: "7",
      comment: "Bé biết phân biệt đúng sai trong các tình huống đơn giản.",
    },
    {
      id: "la-8",
      postMonth: "8",
      comment: "Bé biết trình bày ý kiến cá nhân.",
    },
    {
      id: "la-9",
      postMonth: "9",
      comment: "Bé biết nhận biết các hiện tượng tự nhiên.",
    },
    { id: "la-10", postMonth: "10", comment: "Bé biết giữ gìn vệ sinh chung." },
    {
      id: "la-11",
      postMonth: "11",
      comment: "Bé biết tự tin biểu diễn văn nghệ.",
    },
    { id: "la-12", postMonth: "12", comment: "Bé sẵn sàng cho lớp 1." },
  ];
};

type Comment = {
  id: string;
  postMonth: string;
  comment: string;
};

const groupLabels: Record<string, string> = {
  mam: "Lớp Mầm",
  choi: "Lớp Chồi",
  la: "Lớp Lá",
};

const getGroup = (id: string) => {
  if (id.startsWith("mam")) return "mam";
  if (id.startsWith("choi")) return "choi";
  if (id.startsWith("la")) return "la";
  return "";
};

const CommentChildPage = () => {
  const rawParams = useLocalSearchParams();
  const childId = Array.isArray(rawParams.childId)
    ? rawParams.childId[0]
    : rawParams.childId;

  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCommentsForChild(childId as string);
        setComments(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [childId]);

  const grouped = {
    mam: comments.filter((c) => getGroup(c.id) === "mam"),
    choi: comments.filter((c) => getGroup(c.id) === "choi"),
    la: comments.filter((c) => getGroup(c.id) === "la"),
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00695C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <View style={styles.appBarRow}>
          <TouchableOpacity onPress={() => router.push("/teachers/home")}>
            <Ionicons name="arrow-back" size={28} color="#00695C" />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Nhận Xét Của Bé</Text>
          {/* <View style={{ width: 28 }} /> Để cân bằng layout */}
        </View>
      </View>

      {/* Comment List */}
      {comments.length > 0 ? (
        <FlatList
          data={["mam", "choi", "la"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) =>
            grouped[item as "mam" | "choi" | "la"].length > 0 ? (
              <View key={item}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupHeaderText}>
                    {groupLabels[item as "mam" | "choi" | "la"]}
                  </Text>
                </View>
                {grouped[item as "mam" | "choi" | "la"].map(
                  (comment: Comment) => (
                    <View style={styles.commentItem} key={comment.id}>
                      <Text style={styles.monthText}>
                        Tháng {comment.postMonth}
                      </Text>
                      <View style={styles.commentCard}>
                        <Text style={styles.commentText}>
                          {comment.comment}
                        </Text>
                      </View>
                    </View>
                  )
                )}
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.center}>
          <Text style={styles.noDataText}>Không có nhận xét nào</Text>
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          // Navigate to add comment page
          console.log("Add comment");
        }}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E0F2F1" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  appBar: {
    backgroundColor: "#E0F2F1",
    padding: 25,
    borderBottomWidth: 2,
    borderBottomColor: "#B2DFDB",
    alignItems: "center",
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00695C",
    width: 238,
  },
  listContent: { paddingBottom: 70 },
  commentItem: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  monthText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#004D40",
  },
  commentCard: {
    marginTop: 10,
    backgroundColor: "#00695C",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  commentText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#fff",
  },
  noDataText: { fontSize: 16, color: "#004D40" },
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
  appBarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 320,
    paddingTop: 12,
  },
  groupHeader: {
    backgroundColor: "#B2DFDB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  groupHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00695C",
  },
});
export default CommentChildPage;
