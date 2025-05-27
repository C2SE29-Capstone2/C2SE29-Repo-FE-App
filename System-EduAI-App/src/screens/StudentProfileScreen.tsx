import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const StudentProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Hồ sơ cá nhân</Text>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/120' }}
          style={styles.avatar}
        />
      </View>

      {/* Name & Age */}
      <Text style={styles.name}>Sophia Johnson</Text>
      <Text style={styles.age}>Tuổi: 6</Text>

      {/* Personal Info */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Sửa</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cardText}>Ngày sinh: 16/07/2017</Text>
        <Text style={styles.cardText}>Giới tính: Nữ</Text>
      </View>

      {/* Hobby */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sở thích</Text>
        <Text style={styles.cardText}>Vẽ, đạp xe, đọc sách</Text>
      </View>

      {/* Health */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Tình trạng sức khỏe</Text>
          <TouchableOpacity style={styles.updateBtn}>
            <Text style={styles.updateBtnText}>Cập Nhật</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cardText}>Xuất sắc</Text>
      </View>

      {/* Measurement */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Đo lường</Text>
        <Text style={styles.cardText}>Chiều cao: 110 cm</Text>
        <Text style={styles.cardText}>Cân nặng: 30kg</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { textAlign: 'center', fontSize: 18, color: '#00bcd4', marginVertical: 8, fontWeight: '500' },
  avatarContainer: { alignItems: 'center', marginVertical: 12 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#eee' },
  name: { textAlign: 'center', fontSize: 22, fontWeight: '600', marginTop: 8 },
  age: { textAlign: 'center', fontSize: 16, color: '#888', marginBottom: 12 },
  card: { backgroundColor: '#fafafa', borderRadius: 12, padding: 16, marginVertical: 8, elevation: 1 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  cardText: { fontSize: 15, color: '#333', marginBottom: 2 },
  editBtn: { backgroundColor: '#a5e1ad', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  editBtnText: { color: '#fff', fontWeight: 'bold' },
  updateBtn: { backgroundColor: '#7be0f6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  updateBtnText: { color: '#fff', fontWeight: 'bold' },
});

export default StudentProfileScreen;
