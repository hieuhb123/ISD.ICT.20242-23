import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { getOrCreateUserId } from '../utils/userId';
import { getOrCreateCartId } from '../utils/cartId';

const OrderPage: React.FC = () => {
    const location = useLocation();
    const items = location.state?.items || [];

    const [shippingAddress, setShippingAddress] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [phone, setPhone] = useState('');
    const [isRushOrder, setIsRushOrder] = useState(false);

    // Add state for form validation
    const [formErrors, setFormErrors] = useState({
        receiverName: '',
        phone: '',
        shippingAddress: ''
    });

    // Form validation function
    const validateForm = () => {
        const errors = {
            receiverName: '',
            phone: '',
            shippingAddress: ''
        };
        let isValid = true;

        if (!receiverName.trim()) {
            errors.receiverName = 'Please enter receiver name';
            isValid = false;
        }

        if (!phone.trim()) {
            errors.phone = 'Please enter phone number';
            isValid = false;
        } else if (!/^[0-9]{10}$/.test(phone)) {
            errors.phone = 'Invalid phone number';
            isValid = false;
        }

        if (!shippingAddress.trim()) {
            errors.shippingAddress = 'Please enter shipping address';
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
            shippingInfo: receiverName + '|' + phone,
            items: items.map((item: CartItem) => ({
                productId: item.product.id,
                quantity: item.quantity,
            })),
            province: shippingAddress,
            isRushOrder: isRushOrder,
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
            alert('Order placed successfully! Order ID: ' + (data.id || ''));
        } else {
            alert('Order placement failed!');
        }
    };

    // Check if all products support rush delivery
    const hasRushDeliveryProducts = items.length > 0 && items.every((item: CartItem) => item.product.rushDeliverySupport);

    // Turn off rush order option if any product doesn't support it
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
                                    <td>{Number(item.product.price).toLocaleString('vi-VN')}₫</td>
                                    <td>{(Number(item.product.price) * item.quantity).toLocaleString('vi-VN')}₫</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h4>
                        Total: {items.reduce((sum: number, item: CartItem) => sum + Number(item.product.price) * item.quantity, 0).toLocaleString('vi-VN')}₫
                    </h4>
                    <hr />
                    <h3>Shipping Information</h3>
                    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
                        <div className="mb-3">
                            <label className="form-label">Receiver Name *</label>
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
                            <label className="form-label">Phone Number *</label>
                            <input
                                type="tel"
                                className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                pattern="[0-9]{10}"
                                required
                            />
                            {formErrors.phone && (
                                <div className="invalid-feedback">
                                    {formErrors.phone}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Shipping Address *</label>
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

                        {/* Add Rush Order checkbox if products support it */}
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
                                    Rush Delivery (Express Shipping)
                                </label>
                                <small className="form-text text-muted d-block">
                                    Additional express shipping fee will apply
                                </small>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary">
                            Place Order
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default OrderPage;