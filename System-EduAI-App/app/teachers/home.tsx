import React, { useRef } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { router } from "expo-router";
import Contact from './contact_page'; 
import Account from './account_page';
import Post from './post_page';
import Album from './album';
import Message from './message_page';
import Notification from './notification_page';
import Medicine from './medicine_page';
import Comment from './comment';

const useTeacher = () => ({
  teacher: { fullName: "Nguyễn Thị Hoa" },
  isLoading: false,
});
const useClass = () => ({
  classInf: { name: "Mầm A1" },
  isLoading: false,
});
const useNotifications = () => ({
  notifications: [],
  isLoading: false,
});

interface Teacher {
  fullName: string;
}
interface ClassInfo {
  name: string;
}
interface Notification {
  id: string;
}
interface Post {
  id: string;
  image: any;
  title: string;
  subtitle: string;
  tag: string;
}

type HomeScreenProps = {
  navigation: DrawerNavigationProp<RootParamList, "Home">;
};

type RootParamList = {
  Home: undefined;
  Contact: undefined;
  Account: undefined;
  Post: undefined;
  Album: undefined;
  Message: undefined;
  Notification: undefined;
  Medicine: undefined;
  Comment: undefined;
};

type CustomDrawerContentProps = DrawerContentComponentProps & {
  childName: string;
};

const CustomDrawerContent = (props: CustomDrawerContentProps) => (
  <DrawerContentScrollView
    {...props}
    contentContainerStyle={styles.drawerContent}
  >
    <View style={styles.sidebarItem}>
      <MaterialIcons
        name="person-pin"
        size={30}
        color="white"
        style={styles.icon}
      />
      <Text style={styles.sidebarText}>{props.childName}</Text>
    </View>
    <View style={styles.hr} />
    {[
      { name: "Home", icon: "home", screen: "Home" },
      { name: "Liên Hệ", icon: "headset-mic", screen: "Contact" },
      { name: "Tài Khoản", icon: "person", screen: "Account" },
      { name: "Bài Viết", icon: "featured-play-list", screen: "Post" },
      { name: "Ảnh", icon: "image", screen: "Album" },
      { name: "Nhắn Tin", icon: "chat", screen: "Message" },
      { name: "Thông Báo", icon: "notifications", screen: "Notification" },
      { name: "Dinh Dưỡng", icon: "add-alert", screen: "Medicine" },
      { name: "Nhận Xét", icon: "article", screen: "Comment" },
    ].map((item, index) => (
      <React.Fragment key={index}>
        <DrawerItem
          label={item.name}
          icon={() => (
            <MaterialIcons name={item.icon as any} size={30} color="white" />
          )}
          labelStyle={styles.sidebarText}
          onPress={() =>
            props.navigation.navigate(item.screen as keyof RootParamList)
          }
        />
        <View style={styles.hr} />
      </React.Fragment>
    ))}
  </DrawerContentScrollView>
);

// Main HomeScreen
function HomeScreen({ navigation }: HomeScreenProps) {
  // Use hooks to fetch data
  const { teacher, isLoading: teacherLoading } = useTeacher();
  const { classInf, isLoading: classLoading } = useClass();
  const { notifications, isLoading: notificationsLoading } = useNotifications();

  const isLoading = teacherLoading || classLoading || notificationsLoading;

  // Post data (mocked)
  const posts: Post[] = [
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
  ];

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <Image source={item.image} style={styles.postImage} />
      <View style={{ flexDirection: "row", alignItems: "center", padding: 8 }}>
        <View style={styles.postTagBox}>
          <Text style={styles.postTagText}>{item.tag}</Text>
        </View>
        <Text style={styles.postDetailText}>Xem chi tiết</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <ImageBackground
        source={require("../../assets/images/background.png")}
        style={styles.headerBg}
        imageStyle={styles.headerImage}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
          >
            <MaterialIcons name="menu" size={30} color="white" />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Icon tìm kiếm */}
            <TouchableOpacity
              onPress={() => router.push("/teachers/album")}
              style={{ marginRight: 16 }}
            >
              <MaterialIcons name="search" size={28} color="white" />
            </TouchableOpacity>
            {/* Icon thông báo */}
            <View style={styles.notificationWrapper}>
              <TouchableOpacity
                onPress={() => router.push("/teachers/notification_page")}
              >
                <MaterialIcons
                  name="notifications-active"
                  size={30}
                  color="white"
                />
              </TouchableOpacity>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>
                  {notifications?.length || 0}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.eventBox}>
          <View style={styles.eventRow}>
            <View>
              <Text style={styles.eventTitle}>Sự Kiện Sắp Tới</Text>
              <Text style={styles.eventSubtitle}>Trại Hè Rám Nắng</Text>
              <View style={styles.eventInfoRow}>
                <Text style={styles.eventInfoLabel}>Thời gian dự kiến: </Text>
                <Text style={styles.eventInfoValue}>30/8/2025</Text>
              </View>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={25} color="white" />
          </View>
        </View>
      </ImageBackground>

      {/* Body */}
      <View style={styles.body}>
        {/* Navigation Buttons */}
        <View style={styles.navBox}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/teachers/message_page")}
          >
            <View style={styles.navIconBox}>
              <MaterialIcons name="message" size={24} color="#00695C" />
            </View>
            <Text style={styles.navText}>Nhắn Tin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/teachers/medicine_page")}
          >
            <View style={styles.navIconBox}>
              <MaterialIcons name="add-alert" size={24} color="#00695C" />
            </View>
            <Text style={styles.navText}>Dinh Dưỡng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/teachers/album")}
          >
            <View style={styles.navIconBox}>
              <MaterialIcons name="photo" size={24} color="#00695C" />
            </View>
            <Text style={styles.navText}>Album</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/teachers/comment")}
          >
            <View style={styles.navIconBox}>
              <MaterialIcons name="article" size={24} color="#00695C" />
            </View>
            <Text style={styles.navText}>Nhận Xét</Text>
          </TouchableOpacity>
        </View>

        {/* Teacher Info */}
        <View style={styles.teacherInfoBox}>
          <Image
            source={require("../../assets/images/teacher.png")}
            style={styles.teacherAvatar}
          />
          <View style={styles.teacherInfoTextBox}>
            <View style={styles.teacherInfoRow}>
              <Text style={styles.teacherLabel}>Cô Giáo: </Text>
              <Text style={styles.teacherValue}>
                {teacher?.fullName || "Nguyễn Thị Hoa"}
              </Text>
            </View>
            <View style={styles.teacherInfoRow}>
              <Text style={styles.teacherLabel}>Lớp: </Text>
              <Text style={styles.teacherValue}>{classInf?.name || "Mầm"}</Text>
            </View>
          </View>
        </View>

        {/* Posts Section */}
        <View style={styles.postsSection}>
          <View style={styles.postsHeader}>
            <Text style={styles.postsTitle}>Bài viết</Text>
            <TouchableOpacity
              onPress={() => router.push("/teachers/post_page")}
            >
              <Text style={styles.postsSeeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.postsFilterRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.postsFilterRow}
            >
              <TouchableOpacity
                style={[styles.filterBtn, styles.filterBtnActive]}
              >
                <Text style={styles.filterBtnActiveText}>Montess</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterBtn}>
                <Text style={styles.filterBtnText}>Từ 1 đến 3 tuổi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterBtn}>
                <Text style={styles.filterBtnText}>Cách ăn uống</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterBtn}>
                <Text style={styles.filterBtnText}>Bé tập đi</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <FlatList
            horizontal
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            style={styles.postsList}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Support Section */}
        <View style={styles.supportBox}>
          <View style={styles.supportTextBox}>
            <Text style={styles.supportText}>Hỗ trợ khám</Text>
            <Text style={styles.supportText}>sức khỏe định</Text>
            <Text style={styles.supportText}>kỳ cho bé</Text>
            <TouchableOpacity style={styles.supportBtn}>
              <Text style={styles.supportBtnText}>GỌI NGAY</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require("../../assets/images/support.png")}
            style={styles.supportImage}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const ContactScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Contact Screen</Text>
  </View>
);
const AccountScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Account Screen</Text>
  </View>
);
const PostScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Post Screen</Text>
  </View>
);
const AlbumScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Album Screen</Text>
  </View>
);
const MessageScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Message Screen</Text>
  </View>
);
const NotificationScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Notification Screen</Text>
  </View>
);
const MedicineScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Medicine Screen</Text>
  </View>
);
const CommentScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Comment Screen</Text>
  </View>
);

const Drawer = createDrawerNavigator<RootParamList>();

export default function App() {
  
  const { teacher } = useTeacher();
  const { classInf } = useClass();
  const childName = classInf?.name || teacher?.fullName || "Giáo viên";

  return (
    <NavigationContainer independent>
      <Drawer.Navigator
        drawerContent={(props) => (
          <CustomDrawerContent {...props} childName={childName} />
        )}
        screenOptions={{
          drawerStyle: styles.sidebar,
          drawerPosition: "left",
          headerShown: false,
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Contact" component={Contact} />
        <Drawer.Screen name="Account" component={Account} />
        <Drawer.Screen name="Post" component={Post} />
        <Drawer.Screen name="Album" component={Album} />
        <Drawer.Screen name="Message" component={Message} />
        <Drawer.Screen name="Notification" component={Notification} />
        <Drawer.Screen name="Medicine" component={Medicine} />
        <Drawer.Screen name="Comment" component={Comment} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6fafd" },
  headerBg: {
    padding: 0,
    paddingBottom: 50,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerImage: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  notificationWrapper: { position: "relative" },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  notificationText: { color: "#fff", fontSize: 11, fontWeight: "bold" },

  eventBox: {
    marginTop: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eventTitle: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  eventSubtitle: { color: "#fff", fontSize: 13, marginBottom: 2 },
  eventInfoRow: { flexDirection: "row", marginTop: 2 },
  eventInfoLabel: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  eventInfoValue: { color: "#fff", fontSize: 13 },

  body: { paddingHorizontal: 0, paddingTop: 0, paddingBottom: 16 },
  navBox: {
    backgroundColor: "#fff",
    borderRadius: 24,
    elevation: 2,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginTop: -32,
    zIndex: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  navItem: { alignItems: "center", flex: 1 },
  navIconBox: {
    backgroundColor: "#e0f7fa",
    padding: 12,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    marginTop: -24,
    borderWidth: 3,
    borderColor: "#fff",
  },
  navText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 2,
    color: "#1A3442",
    textAlign: "center",
  },

  teacherInfoBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 2,
    padding: 16,
    marginTop: 24,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  teacherAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  teacherInfoTextBox: { marginLeft: 14 },
  teacherInfoRow: { flexDirection: "row", marginTop: 4 },
  teacherLabel: { fontSize: 15, fontWeight: "500", color: "#333" },
  teacherValue: { fontSize: 15, fontWeight: "bold", color: "#1A3442" },

  postsSection: { marginTop: 20, marginHorizontal: 16 },
  postsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  postsTitle: { fontSize: 16, fontWeight: "bold", color: "#222" },
  postsSeeAll: { color: "#06b6d4", fontSize: 13, fontWeight: "bold" },
  postsFilterRow: {
    flexDirection: "row",
    marginBottom: 8,
    flexWrap: "nowrap", // Không xuống dòng
    overflow: "scroll", // Cho phép scroll ngang
  },
  filterBtn: {
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    minWidth: 80,
  },
  filterBtnActive: { backgroundColor: "#14b8a6" },
  filterBtnText: { color: "#222", fontSize: 13 },
  filterBtnActiveText: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  postsList: { marginTop: 0 },

  postCard: {
    width: 260,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: 80,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  postTagBox: {
    backgroundColor: "#14b8a6",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
  postTagText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  postDetailText: {
    color: "#06b6d4",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: "auto",
  },

  supportBox: {
    backgroundColor: "#e0f7fa",
    borderRadius: 16,
    elevation: 2,
    marginTop: 20,
    marginHorizontal: 16,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  supportTextBox: { flex: 1, padding: 18, justifyContent: "center" },
  supportText: { fontSize: 18, color: "#222", fontWeight: "500" },
  supportBtn: {
    backgroundColor: "#14b8a6",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 14,
    alignSelf: "flex-start",
  },
  supportBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  supportImage: {
    width: 170,
    height: "100%",
    resizeMode: "cover",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  sidebar: {
    width: 250,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  drawerContent: {
    padding: 30,
    paddingTop: 100,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  sidebarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 10,
  },
  hr: {
    borderBottomColor: "white",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});
