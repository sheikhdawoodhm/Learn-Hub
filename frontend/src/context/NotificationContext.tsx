import { createContext, useContext, useState, type ReactNode } from "react";

export type NotificationType = "success" | "error" | "info";

export interface NotificationItem {
  id: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
  notifications: NotificationItem[];
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

import toast from "react-hot-toast";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const showNotification = (message: string, type: NotificationType = "info") => {
    const newNotification: NotificationItem = {
      id: Math.random().toString(36).substring(7),
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev].slice(0, 10));

    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    } else {
      toast(message);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, notifications, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
