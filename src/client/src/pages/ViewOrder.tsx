import React, { useEffect, useState } from "react";
import { Order } from "../types";
import { getOrCreateUserId } from '../utils/userId';
import { useNavigate } from "react-router-dom";

const ViewOrder: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const userId = await getOrCreateUserId();
            const res = await fetch(`http://localhost:8080/api/orders/user/${userId}`);
            const data = await res.json();
            setOrders(data.data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
        if (!confirmCancel) return;

        setCancellingOrderId(orderId);

        try {
            // First, get the payment transaction for this order
            const paymentRes = await fetch(`http://localhost:8080/api/payment/transaction/${orderId}`);
            const paymentData = await paymentRes.json();
            console.log("Payment Data:", paymentData.data);
            
            if (!paymentRes.ok || !paymentData.data) {
                throw new Error(paymentData.message || "Could not find payment transaction");
            }
            
            // Prepare refund data
            const refundData = {
                transactionId: paymentData.data.transactionId || "",
                orderId: orderId,
                errorCode: "00", // Assuming this is a success code
                vnp_Amount: paymentData.data.vnp_Amount,
                vnp_TransactionNo: paymentData.data.vnp_TransactionNo,
                transactionContent: "Refund for cancelled order",
                message: "",
                vnp_PayDate: paymentData.data.vnp_PayDate
            };
            
            // Call refund endpoint
            const refundRes = await fetch(`http://localhost:8080/api/payment/refund`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(refundData)
            });
            
            const refundResult = await refundRes.json();
            
            if (refundRes.ok && refundResult.code === 1) {
                alert("Order cancelled successfully!");
                alert(`Refund successful. Amount: ${(refundResult.data.amount).toLocaleString('vi-VN')}₫\nTransaction ID: ${refundResult.data.id}`);
                
                // Refresh orders to show updated status
                await fetchOrders();
            } else {
                throw new Error(refundResult.message || "Refund failed");
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            alert(`An error occurred while cancelling the order: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setCancellingOrderId(null);
        }
    };

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
                                <td>
                                    {order.status === 'cancelled' ? (
                                        <span className="badge bg-danger">Cancelled</span>
                                    ) : order.status === 'PAID' ? (
                                        <span className="badge bg-success">Paid</span>
                                    ) : (
                                        <span className="badge bg-warning text-dark">Pending</span>
                                    )}
                                </td>
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
                                        <div className="d-flex align-items-center gap-2">
                                            <button
                                                onClick={() => handleCancelOrder(order.id!)}
                                                className="btn btn-sm btn-danger"
                                                disabled={cancellingOrderId === order.id}
                                            >
                                                {cancellingOrderId === order.id ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    'Cancel Order'
                                                )}
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