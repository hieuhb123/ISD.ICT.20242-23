import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Order } from "../types";

const OrderDetail: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/orders/${orderId}`)
            .then(res => res.json())
            .then(data => setOrder(data));
    }, [orderId]);

    if (!order) return <div>Loading...</div>;

    return (
        <div className="container py-4">
            <h2>Order Details {order.id}</h2>
            <p>Order Date: {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</p>
            <p>Receiver: {order.shippingInfo}</p>
            <p>Address: {order.province}</p>
            <p>Status: {order.status}</p>
            <p>Rush Delivery: {order.isRushOrder ? "Yes" : "No"}</p>
            <p>Shipping Fee: {order.shippingFee?.toLocaleString('vi-VN')}₫</p>
            <p>VAT: {order.vat ? order.vat.toLocaleString('vi-VN') + '₫' : '0₫'}</p>
            <p>Total: {order.total?.toLocaleString('vi-VN')}₫</p>
            <h4>Products:</h4>
            <table className="table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item, idx) => (
                        <tr key={idx}>
                            <td>
                                {item.imageURL && (
                                    <img src={item.imageURL?.toString()} alt={item.title?.toString() || item.productId?.toString() || "Product image"} width={60} />
                                )}
                            </td>
                            <td>{item.title || item.productId}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price?.toLocaleString('vi-VN')}₫</td>
                            <td>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderDetail;