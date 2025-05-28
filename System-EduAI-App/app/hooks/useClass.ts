import { useState, useEffect } from 'react';

export interface ClassInfo {
  name: string;
  id?: number;
  studentCount?: number;
}

export const useClass = () => {
  const [classInf, setClassInf] = useState<ClassInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with actual API call when available
    const fetchClass = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setClassInf({
          name: "Lớp Mầm A1",
          id: 1,
          studentCount: 25
        });
      } catch (error) {
        console.error('Error fetching class:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClass();
  }, []);

  return { classInf, isLoading };
};
