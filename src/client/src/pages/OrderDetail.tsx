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

    if (!order) return <div>Đang tải...</div>;

    return (
        <div className="container py-4">
            <h2>Chi tiết đơn hàng {order.id}</h2>
            <p>Ngày đặt: {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</p>
            <p>Người nhận: {order.shippingInfo}</p>
            <p>Địa chỉ: {order.province}</p>
            <p>Trạng thái: {order.status}</p>
            <p>Giao hàng nhanh: {order.isRushOrder ? "Có" : "Không"}</p>
            <p>Phí vận chuyển: {order.shippingFee?.toLocaleString('vi-VN')}₫</p>
            <p>VAT: {order.vat ? order.vat.toLocaleString('vi-VN') + '₫' : '0₫'}</p>
            <p>Tổng tiền: {order.total?.toLocaleString('vi-VN')}₫</p>
            <h4>Sản phẩm:</h4>
            <table className="table">
                <thead>
                    <tr>
                        <th>Ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
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