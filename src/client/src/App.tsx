import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Header from './components/Header';
import CartPage from './pages/Cart';
import Login from './pages/Login';
import Return from './pages/vnpay_return';
import Order from './pages/Order';
import ViewOrder from './pages/ViewOrder';
import OrderDetail from './pages/OrderDetail';
const App: React.FC = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/result" element={<Return />} />
      <Route path="/order" element={<Order />} />
      <Route path="/vieworder" element={<ViewOrder />} />
      <Route path="/order/:orderId" element={<OrderDetail />} />
      {/* Thêm các route khác nếu cần */}
    </Routes>
  </Router>
);

export default App;