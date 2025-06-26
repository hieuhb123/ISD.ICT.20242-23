import React, { useEffect, useState } from 'react';
import { getOrCreateCartId } from '../utils/cartId';
import { CartItem } from '../types';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const navigate = useNavigate();

    // Fetch cart data
    const fetchCart = async () => {
        const cartId = await getOrCreateCartId();
        const res = await fetch(`http://localhost:8080/api/cart/${cartId}`);
        const data = await res.json();
        setCartItems(data.data || []);
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Sửa hàm update quantity
    const updateQuantity = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return; // Không cho phép số lượng < 1

        // Tìm item hiện tại để kiểm tra stock
        const currentItem = cartItems.find(item => item.product.id === productId);
        if (!currentItem) return;

        // Kiểm tra không vượt quá số lượng tồn kho
        if (newQuantity > currentItem.product.quantity) {
            alert(`Chỉ còn ${currentItem.product.quantity} sản phẩm trong kho!`);
            return;
        }

        try {
            const cartId = await getOrCreateCartId();
            const res = await fetch(
                `http://localhost:8080/api/cart/${cartId}/items/${productId}?quantity=${newQuantity}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (res.ok) {
                // Cập nhật local state thay vì fetch lại toàn bộ
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item.product.id === productId
                            ? { ...item, quantity: newQuantity }
                            : item
                    )
                );

            } else {
                console.error('Failed to update quantity');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

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
                                <th>Actions</th>
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
                                    <td>
                                        <div className="d-flex flex-column align-items-center">
                                            <div className="quantity-selector d-flex align-items-center">
                                                <button
                                                    className="btn btn-sm"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    style={{
                                                        background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
                                                        border: 'none',
                                                        color: 'white',
                                                        borderRadius: '20px',
                                                        width: '30px',
                                                        height: '30px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 2px 4px rgba(255,107,107,0.3)'
                                                    }}
                                                >
                                                    −
                                                </button>
                                                
                                                <div 
                                                    className="mx-3 text-center"
                                                    style={{
                                                        minWidth: '40px',
                                                        padding: '5px 10px',
                                                        backgroundColor: '#f1f3f4',
                                                        borderRadius: '15px',
                                                        fontWeight: 'bold',
                                                        fontSize: '16px'
                                                    }}
                                                >
                                                    {item.quantity}
                                                </div>
                                                
                                                <button
                                                    className="btn btn-sm"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.product.quantity}
                                                    style={{
                                                        background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                                                        border: 'none',
                                                        color: 'white',
                                                        borderRadius: '20px',
                                                        width: '30px',
                                                        height: '30px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 2px 4px rgba(78,205,196,0.3)'
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            
                                            <small className="text-muted mt-1" style={{ fontSize: '12px' }}>
                                                {item.product.quantity} trong kho
                                            </small>
                                        </div>
                                    </td>
                                    <td>{item.product.price.toLocaleString('vi-VN')}₫</td>
                                    <td>{(Number(item.product.price) * item.quantity).toLocaleString('vi-VN')}₫</td>
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
                            Total: {Number(cartItems
                                .filter(item => selected.includes(item.product.id))
                                .reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)
                            ).toLocaleString('vi-VN')}₫
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