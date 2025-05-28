import { useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export interface Student {
  studentName: string;
  studentPhone: string;
  studentAddress: string;
  accountEmail: string;
  dateOfBirth: string;
  studentGender: boolean;
  height: number;
  weight: number;
  classroomName: string;
  parentName: string;
  parentPhone: string;
  username?: string;
  healthStatus?: string;
  hobby?: string;
}

export const useStudent = () => {
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchStudentData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!token) {
        setError('Bạn cần đăng nhập để xem thông tin học sinh');
        setIsLoading(false);
        return;
      }

      const studentData = await authApi.getStudentDetail(token);
      
      if (studentData) {
        // Ensure the new fields always have values for UI display
        const enhancedStudentData = {
          ...studentData,
          healthStatus: studentData.healthStatus || 'Healthy',
          hobby: studentData.hobby || 'None',
        };
        
        console.log('Student data with health fields:', enhancedStudentData);
        setStudent(enhancedStudentData);
      } else {
        setError('Không thể tải thông tin học sinh');
      }
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError('Có lỗi xảy ra khi tải thông tin học sinh');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [token]);

  const refetch = () => {
    fetchStudentData();
  };

  return { student, isLoading, error, refetch };
};
