// src/components/UpdateProduct.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MediaItem } from '../types'; // Vẫn import Type từ file chung

// =================================================================
// SECTION 1: API LOGIC (Gộp từ file productApi.ts vào đây)
// =================================================================
// URL cơ sở của API backend
const API_BASE_URL = 'http://localhost:8080/api/product'; // Thay đổi

// Kiểu dữ liệu cho response từ backend
type MediaShopResponse<T> = {
    code: number;
    message: string;
    data?: T;
};

// Hàm xử lý response chung từ API
async function handleResponse<T>(response: Response): Promise<T> {
    const json: MediaShopResponse<T> = await response.json();
    if (!response.ok || json.code !== 200) { // Giả sử SUCCESS_CODE là 200
        throw new Error(json.message || 'Đã có lỗi xảy ra từ server');
    }
    if (!json.data) {
        throw new Error('Không có dữ liệu trả về từ API.');
    }
    return json.data;
}

/**
 * Lấy thông tin chi tiết sản phẩm bằng ID.
 * @param id ID của sản phẩm
 */
const getProductById = async (id: string): Promise<MediaItem> => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return handleResponse<MediaItem>(response);
};

/**
 * Cập nhật thông tin sản phẩm (trừ giá).
 * @param id ID của sản phẩm
 * @param productData Dữ liệu sản phẩm để cập nhật
 */
const updateProductDetails = async (id: string, productData: MediaItem): Promise<MediaItem> => {
    const type = productData.productType.toLowerCase(); // 'book', 'cd', 'dvd'
    const endpoint = `${API_BASE_URL}/update-${type}/${id}`;

    const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    });
    return handleResponse<MediaItem>(response);
};

/**
 * Cập nhật chỉ giá của sản phẩm.
 * @param id ID của sản phẩm
 * @param newPrice Giá mới
 */
const updateProductPrice = async (id: string, newPrice: number): Promise<MediaItem> => {
    const response = await fetch(`${API_BASE_URL}/update-price/${id}?newPrice=${newPrice}`, {
        method: 'PUT',
    });
    return handleResponse<MediaItem>(response);
};


// =================================================================
// SECTION 2: REACT COMPONENT
// =================================================================

const UpdateProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<MediaItem | null>(null);
    const [originalData, setOriginalData] = useState<MediaItem | null>(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // useEffect để fetch dữ liệu sản phẩm, sử dụng hàm getProductById đã định nghĩa ở trên
    useEffect(() => {
        if (!id) {
            setError("ID sản phẩm không hợp lệ.");
            setIsLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const productData = await getProductById(id);
                setFormData(productData); 
                setOriginalData(productData);
            } catch (err: any) {
                setError(err.message || "Không thể tải dữ liệu sản phẩm.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'checkbox' && e.target instanceof HTMLInputElement 
            ? e.target.checked 
            : value;
        setFormData(prev => prev ? { ...prev, [name]: parsedValue } : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !formData || !originalData) return;

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const priceHasChanged = formData.price !== originalData.price;
            if (priceHasChanged) {
                const newPrice = parseInt(String(formData.price), 10);
                if (isNaN(newPrice)) throw new Error("Giá không hợp lệ.");
                // Gọi hàm updateProductPrice đã định nghĩa ở trên
                await updateProductPrice(id, newPrice);
            }
            
            // Gọi hàm updateProductDetails đã định nghĩa ở trên
            const finalUpdatedProduct = await updateProductDetails(id, formData);

            setFormData(finalUpdatedProduct);
            setOriginalData(finalUpdatedProduct);
            setSuccess("Cập nhật sản phẩm thành công!");
            setTimeout(() => navigate('/admin/products'), 2000);

        } catch (err: any) {
            setError(err.message || "Cập nhật thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderSpecificFields = () => {
        if (!formData) return null;
        switch (formData.productType) {
            case 'BOOK':
                return (
                    <>
                        <input name="author" value={formData.author || ''} onChange={handleChange} placeholder="Author" className="form-control mb-2" />
                        <input name="publisher" value={formData.publisher || ''} onChange={handleChange} placeholder="Publisher" className="form-control mb-2" />
                        <input type="date" name="publishDate" value={formData.publishDate?.split('T')[0] || ''} onChange={handleChange} className="form-control mb-2" />
                        <input type="number" name="numOfPages" value={formData.numOfPages || ''} onChange={handleChange} placeholder="Number of Pages" className="form-control mb-2" />
                    </>
                );
            case 'CD':
                return (
                    <>
                        <input name="artist" value={formData.artist || ''} onChange={handleChange} placeholder="Artist" className="form-control mb-2" />
                        <input name="recordLabel" value={formData.recordLabel || ''} onChange={handleChange} placeholder="Record Label" className="form-control mb-2" />
                    </>
                );
            case 'DVD':
                return (
                    <>
                        <input name="director" value={formData.director || ''} onChange={handleChange} placeholder="Director" className="form-control mb-2" />
                        <input name="duration" value={formData.duration || ''} onChange={handleChange} placeholder="Duration (minutes)" className="form-control mb-2" />
                    </>
                );
            default: return null;
        }
    };

    if (isLoading) return <div className="container mt-4"><h2>Đang tải...</h2></div>;
    if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
    if (!formData) return <div className="container mt-4"><h2>Không tìm thấy sản phẩm.</h2></div>;

    return (
        <div className="container mt-4">
            <h2>Chỉnh sửa sản phẩm: {originalData?.title}</h2>
            <p><strong>Loại sản phẩm:</strong> {formData.productType}</p>
            
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Tiêu đề</label>
                    <input name="title" value={formData.title} onChange={handleChange} className="form-control" required />
                </div>
                
                <div className="mb-3">
                    <label className="form-label">Giá</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleChange} className="form-control" rows={4} />
                </div>
                
                <div className="mb-3">
                    <label className="form-label">Số lượng</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="form-control" />
                </div>
                
                <div className="form-check mb-3">
                    <input type="checkbox" name="rushDeliverySupport" checked={formData.rushDeliverySupport} onChange={handleChange} className="form-check-input" />
                    <label className="form-check-label">Hỗ trợ giao hàng hỏa tốc</label>
                </div>

                <hr />
                <h4>Thông tin chi tiết</h4>
                {renderSpecificFields()}
                <hr />

                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;