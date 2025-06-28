import React, { useEffect, useState } from "react";
import { Order } from "../types";
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
            <h2>Your Order List</h2>
            {loading ? (
                <p>Loading...</p>
            ) : orders.length === 0 ? (
                <p>You have no orders yet.</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Order Date</th>
                            <th>Receiver</th>
                            <th>Shipping Address</th>
                            <th>Status</th>
                            <th>Total Amount</th>
                            <th>Details</th>
                            <th>Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</td>
                                <td>{order.shippingInfo}</td>
                                <td>{order.province}</td>
                                {order.status === 'cancelled' ? (
                                    <td className='text-danger'>{order.status}</td>
                                ) : (<td>{order.status}</td>)}
                                <td>{order.total?.toLocaleString('vi-VN')}₫</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => navigate(`/order/${order.id}`)}
                                    >
                                        View
                                    </button>
                                </td>
                                <td>
                                    {order.status !== "PAID" && order.status !== 'cancelled' && (
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={async () => {
                                                // Call API to get payment link
                                                const res = await fetch(`http://localhost:8080/api/payment/pay?orderId=${order.id}`);
                                                const data = await res.json();
                                                if (data.data) {
                                                    window.location.href = data.data; // Redirect to VNPay
                                                } else {
                                                    alert("Failed to get payment link!");
                                                }
                                            }}
                                        >
                                            Pay
                                        </button>
                                    )}
                                    {order.status === "PAID" && (
                                        <div className="flex items-center gap-4">
                                            <span className="badge bg-success">Paid</span>

                                            <button
                                                onClick={async () => {
                                                    const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");
                                                    if (!confirmCancel) return;

                                                    try {
                                                        const res = await fetch(`http://localhost:8080/api/orders/cancel/${order.id}`, {
                                                            method: 'PUT',
                                                        });

                                                        const data = await res.json();

                                                        if (res.ok) {
                                                            alert("Đơn hàng đã được hủy thành công!");
                                                            console.log("Biên lai hoàn tiền: ", data.data.refund);
                                                            alert(`Hoàn tiền thành công số tiền: ${data.data.refund.amount}đ\nMã: ${data.data.refund.id}`);
                                                            window.location.reload();
                                                        } else {
                                                            alert("Hủy đơn hàng thất bại: " + data.message);
                                                        }
                                                    } catch (error) {
                                                        alert("Đã xảy ra lỗi khi hủy đơn hàng: " + error);
                                                    }
                                                }}
                                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                            >
                                                Hủy đơn hàng
                                            </button>
                                        </div>
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