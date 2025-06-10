import React, { useEffect, useState } from 'react';
import { getOrCreateCartId } from '../utils/cartId';
import { Cart } from '../types';

const CartPage: React.FC = () => {
    const [cart, setCart] = useState<Cart | null>(null);

    useEffect(() => {
        const fetchCart = async () => {
            const cartId = await getOrCreateCartId();
            const res = await fetch(`http://localhost:8080/api/cart/${cartId}`);
            const data = await res.json();
            setCart(data.data);
        };
        fetchCart();
    }, []);

    const handleClearCart = async () => {
        if (!cart) return;
        await fetch(`http://localhost:8080/api/cart/${cart.id}/clear`, {
            method: 'POST',
        });
        setCart({ ...cart, listCartItem: [], totalPrice: 0 });
    };

    const handleRemoveItem = async (productId: string) => {
        if (!cart) return;
        await fetch(`http://localhost:8080/api/cart/${cart.id}/remove?productId=${productId}`, {
            method: 'DELETE',
        });
        // Sau khi xóa, cập nhật lại cart
        const res = await fetch(`http://localhost:8080/api/cart/${cart.id}`);
        const data = await res.json();
        setCart(data.data);
    };

    if (!cart) return <div>Loading...</div>;

    return (
        <div className="container py-4">
            <h2>Your Cart</h2>
            {!cart?.listCartItem || cart.listCartItem.length === 0 ? (
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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.listCartItem.map((item, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <img src={item.product.imageUrl} alt={item.product.title} width={60} />
                                    </td>
                                    <td>{item.product.title}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.product.price}</td>
                                    <td>${Number(item.product.price) * item.quantity}</td>
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
                        <h4>Total: ${cart.totalPrice}</h4>
                        <button className="btn btn-danger" onClick={handleClearCart}>Clear Cart</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;