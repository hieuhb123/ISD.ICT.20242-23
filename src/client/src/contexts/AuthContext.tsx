import React, { createContext, useState, useContext, ReactNode } from 'react';

// BƯỚC 1: Định nghĩa "hình dạng" (interface) của đối tượng người dùng
// Điều này giúp đảm bảo dữ liệu người dùng trong toàn bộ ứng dụng luôn nhất quán.
export interface User {
  id: string;
  name: string;
  role: 'Product Manager' | 'Customer' | 'Admin'; // Mở rộng thêm vai trò nếu cần
}

// BƯỚC 2: Định nghĩa những gì Context sẽ cung cấp cho các component con
interface AuthContextType {
  currentUser: User | null;      // Người dùng hiện tại, có thể là null nếu chưa đăng nhập
  login: (user: User) => void;   // Hàm để thực hiện đăng nhập
  logout: () => void;            // Hàm để thực hiện đăng xuất
}

// BƯỚC 3: Tạo Context với một giá trị mặc định
// Giá trị này chỉ được sử dụng như một phương án dự phòng.
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => {}, // Hàm rỗng để tránh lỗi
  logout: () => {}, // Hàm rỗng để tránh lỗi
});

// BƯỚC 4: Tạo component Provider
// Đây là component sẽ "bọc" ứng dụng của bạn và cung cấp dữ liệu.
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Hàm xử lý logic đăng nhập: nhận một đối tượng user và lưu vào state
  const login = (user: User) => {
    setCurrentUser(user);
    console.log(`Người dùng ${user.name} (Role: ${user.role}) đã đăng nhập.`);
  };

  // Hàm xử lý logic đăng xuất: xóa thông tin user khỏi state
  const logout = () => {
    console.log(`Người dùng ${currentUser?.name} đã đăng xuất.`);
    setCurrentUser(null);
  };

  // Tạo ra giá trị sẽ được cung cấp cho toàn bộ ứng dụng
  const value = {
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// BƯỚC 5: Tạo một Custom Hook để sử dụng Context dễ dàng hơn
// Thay vì phải import useContext và AuthContext ở mọi nơi,
// bạn chỉ cần import và gọi useAuth().
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
