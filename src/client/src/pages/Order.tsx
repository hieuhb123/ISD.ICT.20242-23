import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { getOrCreateUserId } from '../utils/userId';
import { getOrCreateCartId } from '../utils/cartId';
import { it } from 'node:test';

const OrderPage: React.FC = () => {
    const location = useLocation();
    const items = location.state?.items || [];

    const [shippingAddress, setShippingAddress] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [phone, setPhone] = useState('');
    const [isRushOrder, setIsRushOrder] = useState(false);

    // Thêm state để quản lý validation
    const [formErrors, setFormErrors] = useState({
        receiverName: '',
        phone: '',
        shippingAddress: ''
    });

    // Hàm validate form
    const validateForm = () => {
        const errors = {
            receiverName: '',
            phone: '',
            shippingAddress: ''
        };
        let isValid = true;

        if (!receiverName.trim()) {
            errors.receiverName = 'Vui lòng nhập tên người nhận';
            isValid = false;
        }

        if (!phone.trim()) {
            errors.phone = 'Vui lòng nhập số điện thoại';
            isValid = false;
        }

        if (!shippingAddress.trim()) {
            errors.shippingAddress = 'Vui lòng nhập địa chỉ giao hàng';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const userId = await getOrCreateUserId();
        const cartId = await getOrCreateCartId();
        const order = {
            userId: userId,
            shippingInfo: receiverName + '|' + phone ,
            items: items.map((item: CartItem) => ({
                productId: item.product.id,
                quantity: item.quantity,
            })),
            province: shippingAddress,
            isRushOrder: isRushOrder, // Thêm trường này
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

    // Kiểm tra tất cả sản phẩm phải hỗ trợ rush delivery
    const hasRushDeliveryProducts = items.length > 0 && items.every((item: CartItem) => item.product.rushDeliverySupport);

    // Nếu có sản phẩm không hỗ trợ rush delivery, tắt tùy chọn này
    useEffect(() => {
        if (!hasRushDeliveryProducts && isRushOrder) {
            setIsRushOrder(false);
        }
    }, [hasRushDeliveryProducts, isRushOrder]);

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
                            <label className="form-label">Tên người nhận *</label>
                            <input
                                type="text"
                                className={`form-control ${formErrors.receiverName ? 'is-invalid' : ''}`}
                                value={receiverName}
                                onChange={e => setReceiverName(e.target.value)}
                                required
                            />
                            {formErrors.receiverName && (
                                <div className="invalid-feedback">
                                    {formErrors.receiverName}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Số điện thoại *</label>
                            <input
                                type="text"
                                className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                            />
                            {formErrors.phone && (
                                <div className="invalid-feedback">
                                    {formErrors.phone}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Địa chỉ giao hàng *</label>
                            <input
                                type="text"
                                className={`form-control ${formErrors.shippingAddress ? 'is-invalid' : ''}`}
                                value={shippingAddress}
                                onChange={e => setShippingAddress(e.target.value)}
                                required
                            />
                            {formErrors.shippingAddress && (
                                <div className="invalid-feedback">
                                    {formErrors.shippingAddress}
                                </div>
                            )}
                        </div>

                        {/* Thêm checkbox Rush Order nếu có sản phẩm hỗ trợ */}
                        {hasRushDeliveryProducts && (
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
                                <small className="form-text text-muted d-block">
                                    Phí giao hàng nhanh sẽ được tính thêm
                                </small>
                            </div>
                        )}

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