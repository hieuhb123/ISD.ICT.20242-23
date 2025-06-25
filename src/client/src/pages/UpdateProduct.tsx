// src/components/UpdateProduct.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MediaItem } from '../types';
import { useAuth } from '../contexts/AuthContext'; // BƯỚC 1: Import hook useAuth

// =================================================================
// SECTION 1: API LOGIC (Giữ nguyên)
// =================================================================

const API_BASE_URL = 'http://localhost:8080/api/product';

type MediaShopResponse<T> = {
    code: number;
    message: string;
    data?: T;
};

async function handleApiResponse<T>(response: Response): Promise<T> {
    const json: MediaShopResponse<T> = await response.json();
    if (!response.ok || json.code !== 1) {
        throw new Error(json.message || 'Đã có lỗi xảy ra từ server');
    }
    if (!json.data) {
        throw new Error('API không trả về dữ liệu.');
    }
    return json.data;
}

const getProductById = (id: string) => {
    return fetch(`${API_BASE_URL}/${id}`).then(handleApiResponse<MediaItem>);
};

const updateProductDetails = (id: string, productData: MediaItem) => {
    const type = productData.productType.toLowerCase();
    const endpoint = `${API_BASE_URL}/update-${type}/${id}`;
    return fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    }).then(handleApiResponse<MediaItem>);
};

const updateProductPrice = (id: string, newPrice: number) => {
    const endpoint = `${API_BASE_URL}/update-price/${id}?newPrice=${newPrice}`;
    return fetch(endpoint, { method: 'PUT' }).then(handleApiResponse<MediaItem>);
};


// =================================================================
// SECTION 2: REACT COMPONENT
// =================================================================

const UpdateProduct: React.FC = () => {
    // BƯỚC 2: Lấy thông tin người dùng từ Context
    const { currentUser } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<MediaItem | null>(null);
    const [originalData, setOriginalData] = useState<MediaItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("ID sản phẩm không được tìm thấy trong URL.");
            setIsLoading(false);
            return;
        }

        // Chỉ fetch dữ liệu khi người dùng đã được xác thực
        if (currentUser) {
            const fetchProductData = async () => {
                try {
                    const productData = await getProductById(id);
                    setFormData(productData);
                    setOriginalData(productData);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProductData();
        } else {
            // Nếu không có người dùng, dừng loading
            setIsLoading(false);
        }
    }, [id, currentUser]); // Thêm currentUser vào dependency array

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'checkbox' && e.target instanceof HTMLInputElement
            ? e.target.checked
            : value;
        setFormData(prev => prev ? { ...prev, [name]: parsedValue } : null);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !formData || !originalData) return;

        // Thêm một lớp kiểm tra nữa ở đây để đảm bảo chỉ manager mới có thể submit
        if (!currentUser || currentUser.role !== 'Product Manager') {
            setError("Bạn không có quyền thực hiện hành động này.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const priceHasChanged = formData.price !== originalData.price;
            await updateProductDetails(id, formData);

            if (priceHasChanged) {
                const newPrice = parseInt(String(formData.price), 10);
                if (isNaN(newPrice)) throw new Error("Giá không hợp lệ.");
                await updateProductPrice(id, newPrice);
            }
            
            const finalUpdatedProduct = await getProductById(id);
            setFormData(finalUpdatedProduct);
            setOriginalData(finalUpdatedProduct);

            setSuccess("Cập nhật sản phẩm thành công!");
            setTimeout(() => navigate('/admin/products'), 2000); // Điều hướng về trang danh sách quản trị

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderSpecificFields = () => { /* ... giữ nguyên ... */ };

    // BƯỚC 3: Thêm lớp bảo vệ cho toàn bộ component
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
    
    if (isLoading) return <div className="container mt-4"><h2>Đang tải dữ liệu...</h2></div>;
    if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
    if (!formData) return <div className="container mt-4"><h2>Không tìm thấy sản phẩm.</h2></div>;

    return (
        <div className="container mt-4">
            <h2>Chỉnh sửa sản phẩm: <span style={{color: '#0d6efd'}}>{originalData?.title}</span></h2>
            <p><strong>Loại:</strong> {formData.productType}</p>
            
            <form onSubmit={handleSubmit} noValidate>
                {success && <div className="alert alert-success">{success}</div>}
                
                <div className="mb-3">
                    <label className="form-label">Tiêu đề</label>
                    <input name="title" value={formData.title} onChange={handleChange} className="form-control" required />
                </div>
                
                <div className="mb-3">
                    <label className="form-label">Giá (VNĐ)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleChange} className="form-control" rows={4} />
                </div>
                
                <hr/>
                <h4>Thông tin chi tiết</h4>
                {renderSpecificFields()}
                <hr/>

                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;
    