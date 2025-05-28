import { useState, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  content: string;
  postDay: string;
  postMonth: string;
  postYear: string;
  isRead?: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with actual API call when available
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setNotifications([
          {
            id: "1",
            title: "Thông báo nghỉ lễ",
            content: "Trường sẽ nghỉ lễ từ ngày 30/4 đến 3/5",
            postDay: "28",
            postMonth: "04",
            postYear: "2025",
            isRead: false
          },
          {
            id: "2", 
            title: "Họp phụ huynh",
            content: "Cuộc họp phụ huynh sẽ diễn ra vào 8h sáng ngày 15/5",
            postDay: "10",
            postMonth: "05", 
            postYear: "2025",
            isRead: false
          }
        ]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return { notifications, isLoading };
};
