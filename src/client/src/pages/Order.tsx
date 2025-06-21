import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { CartItem } from '../types';
import { getOrCreateUserId } from '../utils/userId';
import { getOrCreateCartId } from '../utils/cartId';

const OrderPage: React.FC = () => {
    const location = useLocation();
    const items = location.state?.items || [];

    const [shippingAddress, setShippingAddress] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [phone, setPhone] = useState('');
    const [isRushOrder, setIsRushOrder] = useState(false); // Thêm state cho rush order

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = await getOrCreateUserId();
        const cartId = await getOrCreateCartId();
        const order = {
            userId: userId,
            shippingInfo: receiverName + '|' + phone,
            province: shippingAddress,
            items: items.map((item: CartItem) => ({
                productId: item.product.id,
                quantity: item.quantity,
            })),
            isRushOrder, // Thêm trường này vào order
            createdAt: new Date().toISOString(),
        };
        console.log('Placing order:', order);

        const res = await fetch(`http://localhost:8080/api/orders/place?cartId=${cartId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });

        if (res.ok) {
            const data = await res.json();
            alert('Đặt hàng thành công! Mã đơn: ' + (data.id || ''));
        } else {
            alert('Đặt hàng thất bại!');
        }
    };

    return (
        <div className="container py-4">
            <h2>Order Summary</h2>
            {items.length === 0 ? (
                <p>No items selected for order.</p>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item: CartItem) => (
                                <tr key={item.product.id}>
                                    <td>
                                        <img src={item.product.imageURL} alt={item.product.title} width={60} />
                                    </td>
                                    <td>{item.product.title}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.product.price}</td>
                                    <td>${Number(item.product.price) * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h4>
                        Total: $
                        {items.reduce((sum: number, item: CartItem) => sum + Number(item.product.price) * item.quantity, 0)}
                    </h4>
                    <hr />
                    <h3>Thông tin giao hàng</h3>
                    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
                        <div className="mb-3">
                            <label className="form-label">Tên người nhận</label>
                            <input
                                type="text"
                                className="form-control"
                                value={receiverName}
                                onChange={e => setReceiverName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Số điện thoại</label>
                            <input
                                type="text"
                                className="form-control"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Địa chỉ giao hàng</label>
                            <input
                                type="text"
                                className="form-control"
                                value={shippingAddress}
                                onChange={e => setShippingAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="rushOrder"
                                checked={isRushOrder}
                                onChange={e => setIsRushOrder(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="rushOrder">
                                Giao hàng nhanh (Rush Order)
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Đặt hàng
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default OrderPage;