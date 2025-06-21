import React, { useEffect, useState } from "react";
import { Order } from "../types"; // Giả sử bạn đã định nghĩa kiểu Order trong types.ts
import { getOrCreateUserId } from '../utils/userId';
import { useNavigate } from "react-router-dom";

const ViewOrder: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const userId = await getOrCreateUserId();
            const res = await fetch(`http://localhost:8080/api/orders/user/${userId}`);
            const data = await res.json();
            setOrders(data.data || []);
            setLoading(false);
        };
        fetchOrders();
    }, []);

    return (
        <div className="container py-4">
            <h2>Danh sách đơn hàng của bạn</h2>
            {loading ? (
                <p>Đang tải...</p>
            ) : orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Ngày đặt</th>
                            <th>Người nhận</th>
                            <th>Địa chỉ giao hàng</th>
                            <th>Trạng thái</th>
                            <th>Tổng tiền</th>
                            <th>Chi tiết</th>
                            <th>Thanh toán</th> {/* Thêm cột này */}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</td>
                                <td>{order.shippingInfo}</td>
                                <td>{order.province}</td>
                                <td>{order.status}</td>
                                <td>{order.total?.toLocaleString('vi-VN')}₫</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => navigate(`/order/${order.id}`)}
                                    >
                                        Xem
                                    </button>
                                </td>
                                <td>
                                    {order.status !== "PAID" && (
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={async () => {
                                                // Gọi API lấy link thanh toán
                                                const res = await fetch(`http://localhost:8080/api/payment/pay?orderId=${order.id}`);
                                                const data = await res.json();
                                                if (data.data) {
                                                    window.location.href = data.data; // Chuyển hướng sang VNPay
                                                } else {
                                                    alert("Không lấy được link thanh toán!");
                                                }
                                            }}
                                        >
                                            Pay
                                        </button>
                                    )}
                                    {order.status === "PAID" && (
                                        <span className="badge bg-success">Đã thanh toán</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ViewOrder;