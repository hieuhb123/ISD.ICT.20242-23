// src/components/ProductList.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MediaItem } from '../types';

// API LOGIC
const API_BASE_URL = 'http://localhost:8080/api/product';
type MediaShopResponse<T> = { code: number; message: string; data?: T; };

async function handleApiResponse<T>(response: Response): Promise<T> {
    const json: MediaShopResponse<T> = await response.json();
    if (!response.ok || json.code !== 1) { // Kiểm tra mã thành công là 1
        throw new Error(json.message || 'Lỗi từ server');
    }
    if (typeof json.data === 'undefined') {
        throw new Error("API response không chứa thuộc tính 'data'.");
    }
    return json.data as T;
}

const getAllProducts = (): Promise<MediaItem[]> => {
    return fetch(`${API_BASE_URL}/all`).then(res => handleApiResponse<MediaItem[]>(res));
};

// REACT COMPONENT
const ProductList: React.FC = () => {
    const [products, setProducts] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productList = await getAllProducts();
                setProducts(Array.isArray(productList) ? productList : []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (isLoading) return <div className="container mt-4"><h2>Đang tải...</h2></div>;
    if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Quản lý sản phẩm</h1>
            </div>

            {products.length === 0 ? (
                <div className="alert alert-info">Chưa có sản phẩm nào.</div>
            ) : (
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '10%' }}>Hình ảnh</th>
                            <th scope="col">Tiêu đề</th>
                            <th scope="col">Loại</th>
                            <th scope="col">Giá</th>
                            <th scope="col" style={{ width: '15%' }} className="text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            // Thêm kiểm tra `product` và `product.id` để an toàn
                            product && product.id && (
                                <tr key={product.id}>
                                    <td>
                                        <img 
                                            src={product.imageURL || 'https://via.placeholder.com/60'}
                                            alt={product.title || 'Sản phẩm'} 
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td className="fw-bold">{product.title || 'Không có tiêu đề'}</td>
                                    <td>
                                        {/***************************************************}
                                         * SỬA LỖI Ở ĐÂY                                   *
                                         ***************************************************/}
                                        <span className="badge bg-secondary">
                                            {/* Thêm `|| 'N/A'` để cung cấp giá trị dự phòng nếu productType là null */}
                                            {(product.productType || 'N/A').toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{Number(product.price || 0).toLocaleString('vi-VN')} đ</td>
                                    <td className="text-center">
                                        <Link 
                                            to={`/update-product/${product.id}`} 
                                            className="btn btn-primary btn-sm"
                                        >
                                            Cập nhật
                                        </Link>
                                    </td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProductList;