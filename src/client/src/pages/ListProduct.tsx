// src/components/ProductList.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MediaItem } from '../types';
import { useAuth } from '../contexts/AuthContext'; // BƯỚC 1: Import hook useAuth

// API LOGIC (Giữ nguyên)
const API_BASE_URL = 'http://localhost:8080/api/product';
type MediaShopResponse<T> = { code: number; message: string; data?: T; };

async function handleApiResponse<T>(response: Response): Promise<T> {
    const json: MediaShopResponse<T> = await response.json();
    if (!response.ok || json.code !== 1) {
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
    // BƯỚC 2: Lấy thông tin người dùng từ Context
    const { currentUser } = useAuth(); 

    const [products, setProducts] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Chỉ fetch dữ liệu nếu người dùng đã đăng nhập
        if (currentUser) {
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
        } else {
            // Nếu chưa đăng nhập, không cần tải dữ liệu
            setIsLoading(false);
        }
    }, [currentUser]); // Thêm currentUser vào dependency array

    // BƯỚC 3: Kiểm tra quyền truy cập trước khi hiển thị nội dung
    if (!currentUser || currentUser.role !== 'Product Manager') {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning">
                    <h2>Truy cập bị từ chối</h2>
                    <p>Vui lòng <Link to="/login">đăng nhập</Link> với tài khoản Quản lý sản phẩm để xem trang này.</p>
                </div>
            </div>
        );
    }

    // Phần hiển thị cho người dùng đã đăng nhập
    if (isLoading) return <div className="container mt-4"><h2>Đang tải...</h2></div>;
    if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Quản lý sản phẩm</h1>
                <Link to="/api/ProductManager/add-product" className="btn btn-success">
                    Thêm sản phẩm mới
                </Link>
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
                                        <span className="badge bg-secondary">
                                            {(product.productType || 'N/A').toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{Number(product.price || 0).toLocaleString('vi-VN')} đ</td>
                                    <td className="text-center">
                                        <Link 
                                            to={`/api/ProductManager/update-product/${product.id}`} 
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
