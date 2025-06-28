// src/components/UpdateProduct.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MediaItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

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
    const endpoint = `http://localhost:8080/api/ProductManager/update-${type}/${id}`;
    // Gửi toàn bộ dữ liệu cập nhật
    const body = { ...productData };
    // Không cần gửi id và productType trong body nếu API không yêu cầu
    delete (body as Partial<MediaItem>).id; 
    
    return fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then(handleApiResponse<MediaItem>);
};

// =================================================================
// SECTION 2: REACT COMPONENT
// =================================================================

const BOOK_CATEGORIES = ["Books", "Biographies & Memoirs", "Leaders & Notable People"];

const UpdateProduct: React.FC = () => {
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

        if (currentUser) {
            getProductById(id)
                .then(productData => {
                    setFormData(productData);
                    setOriginalData(productData);
                })
                .catch(err => setError(err.message))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [id, currentUser]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => prev ? { ...prev, [name]: parsedValue } : null);
    }, []);

    const handleCategoryCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            if (!prev) return null;
            const currentCategories = prev.bookCategory || [];
            if (checked) {
                return { ...prev, bookCategory: [...currentCategories, value] };
            } else {
                return { ...prev, bookCategory: currentCategories.filter(category => category !== value) };
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !formData) return;

        if (!currentUser || currentUser.role !== 'Product Manager') {
            setError("You do not have permission to perform this action.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Đảm bảo các trường số được chuyển đổi đúng cách trước khi gửi
            const dataToSend: MediaItem = {
                ...formData,
                price: Number(formData.price) || 0,
                quantity: Number(formData.quantity) || 1,
                weight: String(formData.weight) || "0",
                numOfPages: formData.numOfPages ? Number(formData.numOfPages) : undefined,
            };

            await updateProductDetails(id, dataToSend);
            
            setSuccess("Product updated successfully! Redirecting...");
            setTimeout(() => navigate('/api/ProductManager/list-product'), 2000);

        } catch (err: any) {
            setError(`Lỗi khi cập nhật: ${err.message}`);
            // Khôi phục lại dữ liệu gốc nếu có lỗi
            setFormData(originalData);
        } finally {
            setIsLoading(false);
        }
    };
    
    // === renderSpecificFields` CHO TẤT CẢ CÁC LOẠI ===
    const renderSpecificFields = () => {
        if (!formData) return null;

        switch (formData.productType) {
            case 'book':
                return (
                    <>
                        <div className="mb-3"><label className="form-label">Author</label><input name="author" value={formData.author || ''} onChange={handleChange} className="form-control" /></div>
                        <div className="mb-3"><label className="form-label">Cover Type</label><input name="coverType" value={formData.coverType || ''} onChange={handleChange} className="form-control" /></div>
                        <div className="mb-3"><label className="form-label">Publisher</label><input name="publisher" value={formData.publisher || ''} onChange={handleChange} className="form-control" /></div>
                        <div className="mb-3"><label className="form-label">Publish Date</label><input type="date" name="publishDate" value={formData.publishDate?.split('T')[0] || ''} onChange={handleChange} className="form-control" /></div>
                        <div className="mb-3"><label className="form-label">Number of Pages</label><input type="number" name="numOfPages" value={formData.numOfPages || ''} onChange={handleChange} className="form-control" /></div>
                        <div className="mb-3"><label className="form-label">Language</label><input name="language" value={formData.language || ''} onChange={handleChange} className="form-control" /></div>
                        <div className="mb-3">
                            <label className="form-label">Book Category:</label>
                            {BOOK_CATEGORIES.map(category => (
                                <div className="form-check" key={category}>
                                    <input className="form-check-input" type="checkbox" id={`category-${category}`} value={category} checked={(formData.bookCategory || []).includes(category)} onChange={handleCategoryCheckboxChange}/>
                                    <label className="form-check-label" htmlFor={`category-${category}`}>{category}</label>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case 'cd':
                return (
                    <>
                        <div className="mb-3"><label className="form-label">Artist</label><input name="artist" value={formData.artist || ''} onChange={handleChange} className="form-control" /></div>
                        <div className="mb-3"><label className="form-label">Record Label</label><input name="recordLabel" value={formData.recordLabel || ''} onChange={handleChange} className="form-control" /></div>
                        <div className="mb-3"><label className="form-label">Music Type</label><input name="musicType" value={formData.musicType || ''} onChange={handleChange} className="form-control" /></div>
                        <div className="mb-3"><label className="form-label">Release Date</label><input type="date" name="releasedDate" value={formData.releasedDate?.split('T')[0] || ''} onChange={handleChange} className="form-control" /></div>
                    </>
                );
            case 'dvd':
                return (
                    <>
                        <div className="mb-3"><label className="form-label">Disc Type</label><input name="discType" value={formData.discType || ''} onChange={handleChange} className="form-control" /></div>
                        <div className="mb-3"><label className="form-label">Director</label><input name="director" value={formData.director || ''} onChange={handleChange} className="form-control" /></div>
                        <div className="mb-3"><label className="form-label">Duration (minutes)</label><input name="duration" value={formData.duration || ''} onChange={handleChange} className="form-control" /></div>
                        <div className="mb-3"><label className="form-label">Language</label><input name="language" value={formData.language || ''} onChange={handleChange} className="form-control" /></div>
                        <div className="mb-3"><label className="form-label">Subtitles</label><input name="subtitles" value={formData.subtitles || ''} onChange={handleChange} className="form-control" /></div>
                        <div className="mb-3"><label className="form-label">Release Date</label><input type="date" name="releasedDate" value={formData.releasedDate?.split('T')[0] || ''} onChange={handleChange} className="form-control" /></div>
                        <div className="mb-3"><label className="form-label">Film Type</label><input name="filmType" value={formData.filmType || ''} onChange={handleChange} className="form-control" /></div>
                    </>
                );
            default:
                return <div className="alert alert-secondary">This product has no detailed information.</div>;
        }
    };

    if (!currentUser || currentUser.role !== 'Product Manager') {
        return (
            <div className="container mt-5"><div className="alert alert-warning">
                <h2>Access Denied</h2>
                <p>Please <Link to="/login">log in</Link> with a Product Manager account to view this page.</p>
            </div></div>
        );
    }
    
    if (isLoading) return <div className="container mt-4"><h2>Loading data...</h2></div>;
    if (error && !success) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
    if (!formData) return <div className="container mt-4"><h2>Product not found or you do not have access.</h2></div>;

    return (
        <div className="container mt-4">
            <h2>Edit Product: <span style={{color: '#0d6efd'}}>{originalData?.title}</span></h2>
            <p><strong>Product Type:</strong> {formData.productType.toUpperCase()}</p>
            
            <form onSubmit={handleSubmit} noValidate>
                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                
                <h4>General Information</h4>
                <div className="mb-3"><label className="form-label">Title</label><input name="title" value={formData.title} onChange={handleChange} className="form-control" required /></div>
                <div className="mb-3"><label className="form-label">Price (VND)</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control" required /></div>
                <div className="mb-3"><label className="form-label">Stock Quantity</label><input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="form-control" required /></div>
                <div className="mb-3"><label className="form-label">Weight (kg)</label><input type="number" name="weight" value={formData.weight} onChange={handleChange} className="form-control" required /></div>
                <div className="mb-3"><label className="form-label">Description</label><textarea name="description" value={formData.description || ''} onChange={handleChange} className="form-control" rows={4} /></div>
                <div className="form-check mb-3"><input id="rush-delivery" className="form-check-input" type="checkbox" name="rushDeliverySupport" checked={formData.rushDeliverySupport || false} onChange={handleChange} /><label className="form-check-label" htmlFor="rush-delivery">Support Rush Delivery</label></div>

                <hr/>
                <h4>Detailed Information</h4>
                {renderSpecificFields()}
                <hr/>

                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                    {isLoading ? 'Đang lưu...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;