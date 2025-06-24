// src/components/UpdateProduct.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MediaItem } from '../types';

// =================================================================
// SECTION 1: API LOGIC
// Các hàm giao tiếp với backend được đặt ở đây để dễ quản lý.
// =================================================================

const API_BASE_URL = 'http://localhost:8080/api/product'; // <-- Thay đổi URL này nếu cần

type MediaShopResponse<T> = {
    code: number;
    message: string;
    data?: T;
};

// Hàm xử lý response chung, ném ra lỗi nếu API trả về thất bại
async function handleApiResponse<T>(response: Response): Promise<T> {
    const json: MediaShopResponse<T> = await response.json();
    if (!response.ok || json.code !== 1) { // Giả sử SUCCESS_CODE là 200
        throw new Error(json.message || 'Đã có lỗi xảy ra từ server');
    }
    if (!json.data) {
        throw new Error('API không trả về dữ liệu.');
    }
    return json.data;
}

// Lấy thông tin sản phẩm bằng ID
const getProductById = (id: string) => {
    return fetch(`${API_BASE_URL}/${id}`).then(handleApiResponse<MediaItem>);
};

// Cập nhật thông tin chi tiết (trừ giá)
const updateProductDetails = (id: string, productData: MediaItem) => {
    const type = productData.productType.toLowerCase(); // 'book', 'cd', 'dvd'
    const endpoint = `${API_BASE_URL}/update-${type}/${id}`;
    return fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    }).then(handleApiResponse<MediaItem>);
};

// Cập nhật chỉ giá của sản phẩm
const updateProductPrice = (id: string, newPrice: number) => {
    const endpoint = `${API_BASE_URL}/update-price/${id}?newPrice=${newPrice}`;
    return fetch(endpoint, { method: 'PUT' }).then(handleApiResponse<MediaItem>);
};


// =================================================================
// SECTION 2: REACT COMPONENT
// Component chính để hiển thị và xử lý form.
// =================================================================

const UpdateProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<MediaItem | null>(null);
    const [originalData, setOriginalData] = useState<MediaItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Fetch dữ liệu sản phẩm khi component được tải
    useEffect(() => {
        if (!id) {
            setError("ID sản phẩm không được tìm thấy trong URL.");
            setIsLoading(false);
            return;
        }

        const fetchProductData = async () => {
            try {
                const productData = await getProductById(id);
                setFormData(productData);
                setOriginalData(productData); // Lưu lại dữ liệu gốc để so sánh
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductData();
    }, [id]);

    // Xử lý thay đổi input, sử dụng useCallback để tối ưu
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'checkbox' && e.target instanceof HTMLInputElement
            ? e.target.checked
            : value;
        setFormData(prev => prev ? { ...prev, [name]: parsedValue } : null);
    }, []);

    // Xử lý khi submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !formData || !originalData) return;

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const priceHasChanged = formData.price !== originalData.price;

            // Luôn cập nhật thông tin chi tiết trước
            await updateProductDetails(id, formData);

            // Nếu giá thay đổi, cập nhật giá sau
            if (priceHasChanged) {
                const newPrice = parseInt(String(formData.price), 10);
                if (isNaN(newPrice)) throw new Error("Giá không hợp lệ.");
                await updateProductPrice(id, newPrice);
            }
            
            // Lấy lại dữ liệu mới nhất sau khi đã cập nhật thành công
            const finalUpdatedProduct = await getProductById(id);
            setFormData(finalUpdatedProduct);
            setOriginalData(finalUpdatedProduct);

            setSuccess("Cập nhật sản phẩm thành công!");
            setTimeout(() => navigate('/products'), 2000); // Điều hướng về trang danh sách

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Component con để render các trường đặc thù
    const renderSpecificFields = () => {
        if (!formData) return null;
        switch (formData.productType) {
            case 'BOOK':
                return (
                    <>
                        <input name="author" value={formData.author || ''} onChange={handleChange} placeholder="Tác giả" className="form-control mb-2" />
                        <input name="publisher" value={formData.publisher || ''} onChange={handleChange} placeholder="Nhà xuất bản" className="form-control mb-2" />
                        {/* Các trường khác của sách... */}
                    </>
                );
            case 'CD':
                return <input name="artist" value={formData.artist || ''} onChange={handleChange} placeholder="Nghệ sĩ" className="form-control mb-2" />;
            case 'DVD':
                return <input name="director" value={formData.director || ''} onChange={handleChange} placeholder="Đạo diễn" className="form-control mb-2" />;
            default: return null;
        }
    };
    
    // Render UI
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