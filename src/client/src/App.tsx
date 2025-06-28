import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import AuthProvider đã tạo ở bước trước
import { AuthProvider } from './contexts/AuthContext';

// Import các component và trang của bạn
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Header from './components/Header';
import CartPage from './pages/Cart';
import Login from './pages/Login';
import Return from './pages/vnpay_return';
import Order from './pages/Order';
import ViewOrder from './pages/ViewOrder';
import OrderDetail from './pages/OrderDetail';
import AddProduct from './pages/AddProduct';
import ListProduct from './pages/ListProduct';
import UpdateProduct from './pages/UpdateProduct';
import SignUp from './pages/Sign-up';
import Admin from './pages/Admin';

//... các import khác

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Header />
      <Routes>
        {/* Các route công khai và của người dùng thông thường */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/result" element={<Return />} />
        <Route path="/order" element={<Order />} />
        <Route path="/vieworder" element={<ViewOrder />} />
        <Route path="/order/:orderId" element={<OrderDetail />} />
        <Route path="/signup" element={<SignUp />} />
        {/* === THAY ĐỔI Ở ĐÂY === */}
        {/* Nhóm các route dành cho Product Manager */}
        <Route path="/api/ProductManager/list-product" element={<ListProduct />} />
        <Route path="/api/ProductManager/add-product" element={<AddProduct />} />
        <Route path="/api/ProductManager/update-product/:id" element={<UpdateProduct />} />
        {/* ======================== */}
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
