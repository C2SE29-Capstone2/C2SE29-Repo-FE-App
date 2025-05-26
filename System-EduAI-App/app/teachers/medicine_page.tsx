import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ImageBackground, FlatList, ListRenderItem } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Interface cho MedicineReminder
interface MedicineReminder {
  comment: string;
  currentStatus: string;
  createdDay: string;
  createdMonth: string;
  createdYear: string;
}

// Interface cho Child
interface Child {
  id: string;
  height: number;
  weight: number;
}

// Interface cho route params
type MedicinePageRouteParams = {
  child: Child;
};

// Mock MedicineReminderController
class MedicineReminderController {
  medicineReminder: { value: MedicineReminder[] } = { value: [] };

  async fetchMedicineReminder(childId: string): Promise<MedicineReminder[]> {
    // Mock data fetching
    return new Promise((resolve) => {
      setTimeout(() => {
        this.medicineReminder.value = [
          {
            comment: 'Uống thuốc cảm cúm',
            currentStatus: 'Ốm',
            createdDay: '25',
            createdMonth: '05',
            createdYear: '2025',
          },
          {
            comment: 'Uống vitamin C',
            currentStatus: 'Bình thường',
            createdDay: '24',
            createdMonth: '05',
            createdYear: '2025',
          },
        ];
        resolve(this.medicineReminder.value);
      }, 1000);
    });
  }
}

const controllerRef = React.useRef(new MedicineReminderController());
const controller = controllerRef.current;

const MedicinePage = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, MedicinePageRouteParams>, string>>();
  const child = (route.params as MedicinePageRouteParams)?.child ?? { id: '', height: 0, weight: 0 };
  const [medicineReminders, setMedicineReminders] = useState<MedicineReminder[]>(controller.medicineReminder.value);

  // Periodic data fetching
  useEffect(() => {
    const fetchData = async () => {
      const data = await controller.fetchMedicineReminder(child.id);
      setMedicineReminders(data);
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [child.id]);

  const renderMedicineItem: ListRenderItem<MedicineReminder> = ({ item }) => (
    <View style={styles.medicineItem}>
      <Text style={styles.medicineTitle}>Dặn dò</Text>
      <Text style={styles.medicineComment}>{item.comment}</Text>
      <View style={styles.medicineStatusRow}>
        <Text style={styles.medicineStatusLabel}>Hiện trạng: </Text>
        <Text style={styles.medicineStatus}>{item.currentStatus}</Text>
      </View>
      <Text style={styles.medicineDate}>
        {`${item.createdDay}/${item.createdMonth}/${item.createdYear}`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Image Header */}
        <ImageBackground
          source={require('../../assets/images/imageinfor.png')} // Adjust path as needed
          style={styles.headerImage}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back-ios" size={25} color="white" />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Health Section */}
        <View style={styles.healthContainer}>
          <View style={styles.healthContent}>
            {/* Health Info */}
            <View style={styles.healthHeader}>
              <View style={styles.healthText}>
                <Text style={styles.healthTitle}>Sức Khỏe</Text>
                <Text style={styles.healthSubtitle}>Cảm cúm</Text>
              </View>
              <View style={styles.spacer} />
              <View style={styles.attentionBadge}>
                <Text style={styles.attentionText}>Cần quan tâm kỹ</Text>
                <MaterialIcons name="star" size={15} color="white" style={styles.starIcon} />
              </View>
            </View>

            <View style={styles.divider} />

            {/* Child Info */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialIcons name="emoji-people" size={30} color="#26a69a" />
                <Text style={styles.infoValue}>{`${child.height} cm`}</Text>
                <Text style={styles.infoLabel}>Chiều Cao</Text>
              </View>
              <View style={styles.infoItem}>
                <MaterialIcons name="scale" size={30} color="#26a69a" />
                <Text style={styles.infoValue}>{`${child.weight} kg`}</Text>
                <Text style={styles.infoLabel}>Cân Nặng</Text>
              </View>
              <View style={styles.infoItem}>
                <MaterialIcons name="person-pin" size={30} color="#26a69a" />
                <Text style={styles.infoValue}>Ốm</Text>
                <Text style={styles.infoLabel}>Hiện Trạng</Text>
              </View>
              <View style={styles.infoItem}>
                <MaterialIcons name="notification-important" size={30} color="#26a69a" />
                <Text style={styles.infoValue}>10h trưa</Text>
                <Text style={styles.infoLabel}>Nhắc Thuốc</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Medicine Reminders List */}
            <FlatList
              data={medicineReminders}
              renderItem={renderMedicineItem}
              keyExtractor={(_item, index) => index.toString()}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerImage: {
    width: width,
    height: 280,
  },
  headerContent: {
    paddingTop: 20,
    paddingLeft: 10,
  },
  healthContainer: {
    marginTop: -40,
    width: width,
    backgroundColor: 'white',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 30,
    paddingVertical: 25,
  },
  healthContent: {
    flex: 1,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthText: {
    flexDirection: 'column',
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  healthSubtitle: {
    fontSize: 14,
    color: 'black',
  },
  spacer: {
    flex: 1,
  },
  attentionBadge: {
    width: 140,
    backgroundColor: '#26a69a', // teal[300]
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    marginRight: 15,
  },
  attentionText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  starIcon: {
    marginLeft: 5,
  },
  divider: {
    borderBottomColor: 'rgba(0, 0, 0, 0.54)', // Colors.black45
    borderBottomWidth: 1,
    marginVertical: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoLabel: {
    fontSize: 12,
  },
  medicineItem: {
    width: width - 60, // Account for padding
    height: 150,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
    padding: 10,
    marginVertical: 7.5,
  },
  medicineTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  medicineComment: {
    fontSize: 13,
    marginTop: 5,
  },
  medicineStatusRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  medicineStatusLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  medicineStatus: {
    fontSize: 13,
  },
  medicineDate: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  },
});

export default MedicinePage;