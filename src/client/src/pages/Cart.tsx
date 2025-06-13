import React, { useEffect, useState } from 'react';
import { getOrCreateCartId } from '../utils/cartId';
import { Cart, CartItem } from '../types';

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    
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
    };

    const handleRemoveItem = async (productId: string) => {
        if (cartItems.length === 0) return;
        const cartId = await getOrCreateCartId();
        await fetch(`http://localhost:8080/api/cart/remove?cartId=${cartId}&productId=${productId}`, {
            method: 'DELETE',
        });
        setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
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
                        <button className="btn btn-danger" onClick={handleClearCart}>Clear Cart</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;