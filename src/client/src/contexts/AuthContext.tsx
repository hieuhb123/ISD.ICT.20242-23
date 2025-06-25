import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {User} from '../types'; 

// Định nghĩa những gì Context sẽ cung cấp 
interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Tạo Context với một giá trị mặc định 
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => {},
  logout: () => {},
});

// BƯỚC 4: Tạo component Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  //  tạo state từ localStorage
  // Sử dụng hàm callback trong useState để logic này chỉ chạy một lần duy nhất khi component được tạo.
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      // Nếu có dữ liệu trong localStorage, chuyển nó từ chuỗi JSON về lại object
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu người dùng từ localStorage:", error);
      return null;
    }
    return null; // Nếu không có gì thì trả về null
  });

  // Sử dụng useEffect để tự động đồng bộ state với localStorage
  // Hook này sẽ được kích hoạt mỗi khi giá trị của `currentUser` thay đổi.
  useEffect(() => {
    if (currentUser) {
      // Khi người dùng đăng nhập (currentUser có giá trị), lưu vào localStorage.
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      // Khi người dùng đăng xuất (currentUser là null), xóa khỏi localStorage.
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Hàm login bây giờ chỉ cần cập nhật state, useEffect sẽ lo phần còn lại.
  const login = (user: User) => {
    setCurrentUser(user);
    console.log(`Người dùng ${user.name} (Role: ${user.role}) đã đăng nhập.`);
  };

  // Hàm logout cũng chỉ cần cập nhật state.
  const logout = () => {
    console.log(`Người dùng ${currentUser?.name} đã đăng xuất.`);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Tạo một Custom Hook để sử dụng Context dễ dàng hơn 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};