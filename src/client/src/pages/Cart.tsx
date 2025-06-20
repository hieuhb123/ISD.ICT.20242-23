import React, { useEffect, useState } from 'react';
import { getOrCreateCartId } from '../utils/cartId';
import { CartItem } from '../types';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            const cartId = await getOrCreateCartId();
            const res = await fetch(`http://localhost:8080/api/cart/${cartId}`);
            const data = await res.json();
            setCartItems(data.data || []);
        };
        fetchCart();
    }, []);

    const handleClearCart = async () => {
        if (cartItems.length === 0) return;
        const cartId = await getOrCreateCartId();
        await fetch(`http://localhost:8080/api/cart/clear?cartId=${cartId}`, {
            method: 'POST',
        });
        setCartItems([]);
        setSelected([]);
    };

    const handleRemoveItem = async (productId: string) => {
        if (cartItems.length === 0) return;
        const cartId = await getOrCreateCartId();
        await fetch(`http://localhost:8080/api/cart/remove?cartId=${cartId}&productId=${productId}`, {
            method: 'DELETE',
        });
        setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
        setSelected(prev => prev.filter(id => id !== productId));
    };

    const handleSelect = (productId: string) => {
        setSelected(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelected(cartItems.map(item => item.product.id));
        } else {
            setSelected([]);
        }
    };

    const handlePlaceOrder = () => {
        const selectedItems = cartItems.filter(item => selected.includes(item.product.id));
        if (selectedItems.length === 0) return;
        // Chuyển hướng sang trang order, truyền selectedItems qua state
        navigate('/order', { state: { items: selectedItems } });
    };

    return (
        <div className="container py-4">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selected.length === cartItems.length && cartItems.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(item.product.id)}
                                            onChange={() => handleSelect(item.product.id)}
                                        />
                                    </td>
                                    <td>
                                        <img src={item.product.imageURL} alt={item.product.title} width={60} />
                                    </td>
                                    <td>{item.product.title}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.product.price}</td>
                                    <td>${Number(item.product.price) * item.quantity}</td>
                                    <td>
                                        {item.statusCode === 2
                                            ? <span className="badge bg-danger">Đã xóa</span>
                                            : item.statusCode === 0
                                                ? <span className="badge bg-warning text-dark">Hết hàng</span>
                                                : <span className="badge bg-success">Còn hàng</span>
                                        }
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleRemoveItem(item.product.id)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between align-items-center">
                        <h4>
                            Total: $
                            {cartItems.reduce((sum, item) =>
                                sum + Number(item.product.price) * item.quantity, 0)}
                        </h4>
                        <div>
                            <button className="btn btn-danger me-2" onClick={handleClearCart}>Clear Cart</button>
                            <button
                                className="btn btn-primary"
                                disabled={selected.length === 0}
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;