import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MediaItem} from '../types'; 

import { useAuth } from '../contexts/AuthContext';

type MediaShopResponse<T> = { code: number; message: string; data?: T; };

// THAY ĐỔI: Cải thiện handleApiResponse để xử lý các response không có body (phổ biến với DELETE)
async function handleApiResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) { // 204 No Content là một thành công
        return undefined as T;
    }
    const text = await response.text();
    if (!text) { // Xử lý trường hợp body trống nhưng status không phải 204
        if (response.ok) return undefined as T;
        throw new Error('Server trả về phản hồi trống.');
    }
    const json: MediaShopResponse<T> = JSON.parse(text);
    if (!response.ok || (json.code && json.code !== 1)) {
        throw new Error(json.message || 'Lỗi từ server');
    }
    return json.data as T;
}

const getAllProducts = (userId: string): Promise<MediaItem[]> => {
    return fetch(`http://localhost:8080/api/ProductManager/products?userId=${userId}`).then(res => handleApiResponse<MediaItem[]>(res));
};

// THAY ĐỔI: Cập nhật hàm xóa sản phẩm để gửi kèm userId
const deleteProductById = (productId: string, userId: string): Promise<void> => {
    // URL khớp với backend: /delete/{id}?userId=...
    return fetch(`http://localhost:8080/api/ProductManager/delete/${productId}?userId=${userId}`, {
        method: 'DELETE',
    }).then(res => handleApiResponse<void>(res));
};

// MỚI: Hàm API để xóa hàng loạt sản phẩm, hiệu quả hơn
const deleteListProduct = (productIds: string[], userId: string): Promise<void> => {
    const params = new URLSearchParams();
    params.append('userId', userId);
    productIds.forEach(id => params.append('ids', id));
    
    // URL khớp với backend: /delete-list?userId=...&ids=...&ids=...
    return fetch(`http://localhost:8080/api/ProductManager/delete-list?${params.toString()}`, {
        method: 'DELETE',
    }).then(res => handleApiResponse<void>(res));
};


// --- REACT COMPONENT ---
const ProductList: React.FC = () => {
    const { currentUser } = useAuth(); // currentUser bây giờ có kiểu User | null
    const [products, setProducts] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

    useEffect(() => {
        if (currentUser) {
            const fetchProducts = async () => {
                try {
                    const productList = await getAllProducts(currentUser.id);
                    setProducts(Array.isArray(productList) ? productList : []);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProducts();
        } else {
            setIsLoading(false);
        }
    }, [currentUser]);

    const handleSelectProduct = (productId: string) => {
        // ... không thay đổi
        setSelectedProducts(prevSelected =>
            prevSelected.includes(productId)
                ? prevSelected.filter(id => id !== productId)
                : [...prevSelected, productId]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        // ... không thay đổi
        if (e.target.checked) {
            setSelectedProducts(products.map(p => p.id));
        } else {
            setSelectedProducts([]);
        }
    };
    
    // THAY ĐỔI: Cập nhật logic xóa để truyền userId
    const handleDeleteProduct = async (productId: string, productTitle: string) => {
        if (!currentUser?.id) {
            setError("Không tìm thấy thông tin người dùng để thực hiện hành động này.");
            return;
        }
        if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productTitle}"?`)) {
            try {
                await deleteProductById(productId, currentUser.id);
                setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
                setError(null); // Xóa lỗi cũ nếu thành công
            } catch (err: any) {
                setError(`Lỗi khi xóa sản phẩm: ${err.message}`);
            }
        }
    };

    // THAY ĐỔI: Cập nhật logic xóa hàng loạt để gọi API mới hiệu quả
    const handleDeleteSelected = async () => {
        if (!currentUser?.id) {
            setError("Không tìm thấy thông tin người dùng để thực hiện hành động này.");
            return;
        }
        if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm đã chọn?`)) {
            try {
                // Chỉ gọi API một lần duy nhất
                await deleteListProduct(selectedProducts, currentUser.id);
                setProducts(prevProducts => prevProducts.filter(p => !selectedProducts.includes(p.id)));
                setSelectedProducts([]);
                setError(null); // Xóa lỗi cũ nếu thành công
            } catch (err: any) {
                setError(`Lỗi khi xóa các sản phẩm đã chọn: ${err.message}`);
            }
        }
    }

    // ... Phần JSX không thay đổi so với lần trước ...
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

    if (isLoading) return <div className="container mt-4"><h2>Đang tải...</h2></div>;
    
    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Quản lý sản phẩm</h1>
                <div>
                    {selectedProducts.length > 0 && (
                        <button className="btn btn-danger me-2" onClick={handleDeleteSelected}>
                            Xóa {selectedProducts.length} sản phẩm
                        </button>
                    )}
                    <Link to="/api/ProductManager/add-product" className="btn btn-success">
                        Thêm sản phẩm mới
                    </Link>
                </div>
            </div>
            
            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            {products.length === 0 ? (
                <div className="alert alert-info">Chưa có sản phẩm nào.</div>
            ) : (
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '5%' }}>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    onChange={handleSelectAll}
                                    checked={products.length > 0 && selectedProducts.length === products.length}
                                />
                            </th>
                            <th scope="col" style={{ width: '10%' }}>Hình ảnh</th>
                            <th scope="col">Tiêu đề</th>
                            <th scope="col">Loại</th>
                            <th scope="col">Giá</th>
                            <th scope="col" style={{ width: '20%' }} className="text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            product && product.id && (
                                <tr key={product.id} className={selectedProducts.includes(product.id) ? 'table-active' : ''}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={selectedProducts.includes(product.id)}
                                            onChange={() => handleSelectProduct(product.id)}
                                        />
                                    </td>
                                    <td>
                                        <Link to={`/product/${product.id}`}>
                                            <img
                                                src={product.imageURL || 'https://via.placeholder.com/60'}
                                                alt={product.title || 'Sản phẩm'}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                        </Link>
                                    </td>
                                    <td className="fw-bold">
                                        <Link to={`/product/${product.id}`} className="text-dark text-decoration-none">
                                            {product.title || 'Không có tiêu đề'}
                                        </Link>
                                    </td>
                                    <td>
                                        <span className="badge bg-secondary">
                                            {(product.productType || 'N/A').toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{Number(product.price || 0).toLocaleString('vi-VN')} đ</td>
                                    <td className="text-center">
                                        <Link
                                            to={`/api/ProductManager/update-product/${product.id}`}
                                            className="btn btn-primary btn-sm me-2"
                                        >
                                            Cập nhật
                                        </Link>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteProduct(product.id, product.title)}
                                        >
                                            Xóa
                                        </button>
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