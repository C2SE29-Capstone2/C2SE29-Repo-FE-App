import { useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export interface Teacher {
  teacherName: string;
  teacherPhone: string;
  teacherAddress: string;
  accountEmail: string;
  dateOfBirth: string;
  teacherGender: boolean;
  qualifications: string;
  username?: string;
}

export const useTeacher = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchTeacher = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const teacherData = await authApi.getTeacherDetail(token);
      
      if (teacherData) {
        setTeacher(teacherData);
        setError(null);
      } else {
        setError('Không thể lấy thông tin giáo viên');
      }
    } catch (err) {
      console.error('Error fetching teacher:', err);
      setError('Lỗi khi tải thông tin giáo viên');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, [token]);

  return { teacher, isLoading, error, refetch: fetchTeacher };
};
