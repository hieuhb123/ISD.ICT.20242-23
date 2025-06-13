import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MediaItem } from '../types';
import { getOrCreateCartId } from '../utils/cartId';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<MediaItem | null>(null);
    const [amount, setAmount] = useState<number>(1);

    useEffect(() => {
        fetch(`http://localhost:8080/api/product/${id}`)
            .then(res => res.json())
            .then(data => setItem(data.data))
            .catch(err => console.error('Failed to fetch item info:', err));
    }, [id]);

    const handleAddToCart = async () => {
        if (!item) return;
        const cartId = await getOrCreateCartId();
        const params = new URLSearchParams({
            productId: item.id,
            quantity: amount.toString(),
        });
        const res = await fetch(`http://localhost:8080/api/cart/${cartId}/add?${params.toString()}`, {
            method: 'POST',
        });
        if (res.ok) {
            alert('Added to cart!');
        } else {
            alert('Failed to add to cart!');
        }
    };

    if (!item) return <div>Loading...</div>;

    return (
        <div className="container py-4">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{item.title}</li>
                </ol>
            </nav>
            <div className="row">
                {/* Left: Product Images */}
                <div className="col-md-5">
                    <img src={item.imageURL} className="img-fluid border mb-2" alt={item.title} style={{ maxHeight: 400, objectFit: 'contain' }} />
                    {/* Nếu có nhiều ảnh, render thêm thumbnail ở đây */}
                    {/* <div className="d-flex gap-2">
                        <img src={item.imageURL} width={60} className="border" alt="" />
                        ... 
                    </div> */}
                </div>
                {/* Right: Product Info */}
                <div className="col-md-7">
                    <h3>{item.title}</h3>
                    <div className="mb-2">
                        <span className="fs-4 text-danger fw-bold">{item.price}₫</span>
                        {/* <span className="text-muted ms-2"><del>Giá gốc</del></span> */}
                    </div>
                    <div className="mb-2">
                        <span className="badge bg-secondary">{item.category}</span>
                    </div>
                    <div className="mb-3">
                        <label className="me-2">Số lượng:</label>
                        <input
                            type="number"
                            min={1}
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            style={{ width: 70, display: 'inline-block' }}
                            className="form-control d-inline-block me-2"
                        />
                        <button className="btn btn-danger" onClick={handleAddToCart}>Thêm Vào Giỏ Hàng</button>
                    </div>
                    {/* Thông tin thêm nếu muốn */}
                    <div className="mb-2">
                        <span>Số lượng còn lại: {item.quantity}</span>
                    </div>
                </div>
            </div>
            {/* Product Detail Section */}
            <div className="row mt-4">
                <div className="col-md-8">
                    <div className="bg-white p-3 rounded shadow-sm mb-3">
                        <h5 className="mb-3">CHI TIẾT SẢN PHẨM</h5>
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td className="text-muted" style={{ width: 200 }}>Danh mục</td>
                                    <td>{item.category}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Số lượng còn lại</td>
                                    <td>{item.quantity}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Khối lượng</td>
                                    <td>{item.weight}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Hỗ trợ giao hàng nhanh</td>
                                    <td>{item.rushDeliverySupport ? 'Có' : 'Không'}</td>
                                </tr>
                                {item.dimension && (
                                    <tr>
                                        <td className="text-muted">Kích thước (dài x rộng x cao)</td>
                                        <td>{item.dimension}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                        <h5 className="mb-3">MÔ TẢ SẢN PHẨM</h5>
                        <div style={{ whiteSpace: 'pre-line' }}>
                            {item.description || 'Không có mô tả.'}
                        </div>
                    </div>
                </div>
                {/* Sidebar: Có thể thêm voucher, sản phẩm nổi bật, ... */}
                <div className="col-md-4">
                    {/* ... */}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;