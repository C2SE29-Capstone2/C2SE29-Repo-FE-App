import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const days = [
    { label: "Thứ 2", date: 15 },
    { label: "Thứ 3", date: 16 },
    { label: "Thứ 4", date: 17 },
    { label: "Thứ 5", date: 18 },
    { label: "Thứ 6", date: 19 },
    { label: "Thứ 7", date: 20 },
    { label: "Chủ nhật", date: 21 },
];

const initialActivities = [
    {
        icon: require("../../assets/images/book.png"),
        title: "Học buổi sáng",
        timeStart: "10:30",
        timeEnd: "11:30",
        tag: "Học tập",
    },
    {
        icon: require("../../assets/images/game.png"),
        title: "Thời gian chơi",
        timeStart: "10:30",
        timeEnd: "11:30",
        tag: "Trò chơi",
    },
    {
        icon: require("../../assets/images/sleep.png"),
        title: "Ngủ trưa",
        timeStart: "12:30",
        timeEnd: "13:30",
        tag: "Giấc ngủ",
    },
];

const CreateSchedule = () => {
    const router = useRouter();
    const [selectedDay, setSelectedDay] = useState(0);
    const [activities, setActivities] = useState(initialActivities);

    return (
        <View style={styles.root}>
            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.headerIconLeft}
                >
                    <Ionicons name="arrow-back" size={24} color="#00bcd4" />
                </TouchableOpacity>
                <View style={styles.headerTitleRow}>
                    <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#00bcd4"
                        style={{ marginRight: 6 }}
                        height={32}
                    />
                    <Text style={styles.headerTitle}>Tạo kế hoạch</Text>
                </View>
                <TouchableOpacity style={styles.headerIconRight}>
                    <Ionicons name="notifications-outline" size={24} color="#00bcd4" />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>2</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Greeting */}
                <View style={styles.greetingRow}>
                    <Image
                        source={require("../../assets/images/student_2_nam.png")}
                        style={styles.avatar}
                    />
                    <View>
                        <Text style={styles.greetingText}>Chào Ngọc!</Text>
                        <Text style={styles.greetingSubText}>
                            Hãy lên kế hoạch ngày tuyệt vời!
                        </Text>
                    </View>
                </View>

                {/* Days */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.daysRow}
                >
                    {days.map((d, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[
                                styles.dayBox,
                                selectedDay === idx && styles.dayBoxActive,
                            ]}
                            onPress={() => setSelectedDay(idx)}
                        >
                            <Text
                                style={[
                                    styles.dayLabel,
                                    selectedDay === idx && styles.dayLabelActive,
                                ]}
                            >
                                {d.label}
                            </Text>
                            <Text
                                style={[
                                    styles.dayDate,
                                    selectedDay === idx && styles.dayDateActive,
                                ]}
                            >
                                {d.date}
                            </Text>
                            {selectedDay === idx && <View style={styles.dot} />}
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Các hoạt động hôm nay */}
                <View style={styles.todayActivitiesRow}>
                    <Text style={styles.todayActivitiesTitle}>
                        Các hoạt động hôm nay
                    </Text>
                    <TouchableOpacity
                        style={styles.addButton}
                    // TODO: Thêm chức năng thêm hoạt động mới
                    >
                        <Ionicons name="add" size={24} color="#00bcd4" />
                    </TouchableOpacity>
                </View>

                {/* Danh sách hoạt động */}
                {activities.map((item, idx) => (
                    <View key={idx} style={styles.activityBox}>
                        <View style={styles.activityHeader}>
                            <Image source={item.icon} style={styles.activityIcon} />
                            <Text style={styles.activityTitle}>{item.title}</Text>
                            <View style={{ flex: 1 }} />
                            <TouchableOpacity>
                                <Ionicons name="trash-outline" size={20} color="#00bcd4" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.timeRow}>
                            <Ionicons name="time-outline" size={16} color="#00bcd4" />
                            <Text style={styles.timeText}>
                                {item.timeStart} - {item.timeEnd}
                            </Text>
                        </View>
                        <View style={styles.tagRow}>
                            <Ionicons name="pricetag-outline" size={14} color="#00bcd4" />
                            <Text style={styles.tagText}>{item.tag}</Text>
                        </View>
                    </View>
                ))}

                {/* Nút Lưu */}
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Lưu</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#fff" },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 38,
        paddingHorizontal: 0,
        backgroundColor: "#e6fafd",
        borderBottomWidth: 0.5,
        borderBottomColor: "#e0e0e0",
        height: 70,
        position: "relative",
    },
    headerIconLeft: {
        position: "absolute",
        left: 16,
        top: 38,
        zIndex: 2,
    },
    headerIconRight: {
        position: "absolute",
        right: 16,
        top: 38,
        zIndex: 2,
    },
    headerTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        marginLeft: 0,
        marginRight: 0,
    },
    headerTitle: {
        fontSize: 20,
        color: "#00bcd4",
        fontWeight: "bold",
        textAlign: "center",
        height: 40,
    },
    badge: {
        position: "absolute",
        top: -4,
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
    container: { flex: 1, paddingHorizontal: 0 },
    greetingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 18,
        marginBottom: 10,
        marginLeft: 16,
    },
    avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 14 },
    greetingText: { fontSize: 20, fontWeight: "bold", color: "#222" },
    greetingSubText: { fontSize: 14, color: "#888" },
    daysRow: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginBottom: 18,
        marginTop: 8,
    },
    dayBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e0e0e0",
        minWidth: 60,
        position: "relative",
    },
    dayBoxActive: {
        backgroundColor: "#00bcd4",
        borderColor: "#00bcd4",
    },
    dayLabel: { color: "#888", fontWeight: "bold", fontSize: 15 },
    dayLabelActive: { color: "#fff" },
    dayDate: { color: "#888", fontWeight: "bold", fontSize: 17 },
    dayDateActive: { color: "#fff" },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#fff",
        position: "absolute",
        bottom: 6,
        left: "50%",
        marginLeft: -3,
    },
    todayActivitiesRow: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        marginBottom: 10,
        marginTop: 8,
    },
    todayActivitiesTitle: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#00bcd4",
        backgroundColor: "#e6fafd",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        flex: 1,
    },
    addButton: {
        marginLeft: 10,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 4,
        borderWidth: 1,
        borderColor: "#00bcd4",
        justifyContent: "center",
        alignItems: "center",
        width: 32,
        height: 32,
    },
    activityBox: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 14,
        marginHorizontal: 16,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    activityHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    activityIcon: { width: 32, height: 32, marginRight: 10 },
    activityTitle: { fontSize: 16, fontWeight: "bold", color: "#222" },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
        marginLeft: 2,
    },
    timeText: { fontSize: 14, color: "#00bcd4", marginLeft: 4 },
    tagRow: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 2,
    },
    tagText: { fontSize: 14, color: "#888", marginLeft: 4 },
    saveButton: {
        backgroundColor: "#4ee04e",
        borderRadius: 10,
        marginHorizontal: 16,
        marginTop: 10,
        marginBottom: 30,
        paddingVertical: 14,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
});

export default CreateSchedule;
