// === BƯỚC 1: IMPORT USEEFFECT VÀ USEREF ===
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MediaItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

const initialFormState: Partial<MediaItem> = {
    title: '',
    price: '',
    description: '',
    quantity: 1,
    weight: '',
    rushDeliverySupport: false,
    isDeleted: false,
    artist: '',
    recordLabel: '',
    musicType: '',
    releasedDate: '',
    author: '',
    coverType: '',
    publisher: '',
    publishDate: '',
    numOfPages: undefined,
    language: '',
    bookCategory: [],
    discType: '',
    director: '',
    duration: '',
    subtitles: '',
    filmType: '',
};

const AddProduct: React.FC = () => {
    const { currentUser } = useAuth(); 
    const navigate = useNavigate();

    const [productType, setProductType] = useState<'cd' | 'book' | 'dvd'>('cd');
    const [formData, setFormData] = useState<Partial<MediaItem>>(initialFormState);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // === BƯỚC 2: KHỞI TẠO REF ĐỂ THEO DÕI TRẠNG THÁI MOUNT ===
    const isMounted = useRef(false);

    // === BƯỚC 3: SỬ DỤNG USEEFFECT ĐỂ CẬP NHẬT REF KHI COMPONENT MOUNT/UNMOUNT ===
    useEffect(() => {
        isMounted.current = true; // Đánh dấu là component đã mount
        return () => {
            // Hàm cleanup này sẽ chạy khi component bị unmount
            isMounted.current = false; // Đánh dấu là component đã unmount
        };
    }, []); // Mảng rỗng đảm bảo effect chỉ chạy 1 lần khi mount và cleanup khi unmount

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let parsedValue: any = value;
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            parsedValue = e.target.checked;
        }
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as 'cd' | 'book' | 'dvd';
        setProductType(newType);
        setFormData(initialFormState);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Các lệnh setState ở đây an toàn vì chúng chạy đồng bộ trước khi có await
        setError('');
        setIsLoading(true);

        if (!currentUser?.id) {
            setError('Không tìm thấy thông tin người quản lý. Vui lòng đăng nhập lại.');
            setIsLoading(false);
            return;
        }
        if (!imageFile) {
            setError('Vui lòng chọn ảnh cho sản phẩm.');
            setIsLoading(false);
            return;
        }

        const productData: Partial<MediaItem> = {
            ...formData,
            productType,
            price: parseFloat(String(formData.price)) || 0,
            numOfPages: formData.numOfPages ? parseInt(String(formData.numOfPages)) : undefined,
            bookCategory: typeof formData.bookCategory === 'string' ? (formData.bookCategory as string).split(',') : formData.bookCategory,
        };

        const submissionFormData = new FormData();
        submissionFormData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
        submissionFormData.append('image', imageFile);

        try {
            const url = `http://localhost:8080/api/ProductManager/add-${productType}?userId=${encodeURIComponent(currentUser.id)}`;
            const response = await fetch(url, {
                method: 'POST',
                body: submissionFormData,
            });

            // Sau khi `await`, component có thể đã bị unmount.
            // Vì vậy, tất cả các lệnh cập nhật state từ đây trở đi cần được kiểm tra.

            if (response.ok) {
                alert('Thêm sản phẩm thành công!');
                // Lệnh navigate() sẽ khiến component bị unmount.
                // Mọi lệnh setState sau lệnh này chắc chắn sẽ gây ra warning nếu không được kiểm tra.
                navigate('/api/ProductManager/list-product');
            } else {
                const errorData = await response.json();
                // === BƯỚC 4: KIỂM TRA isMounted TRƯỚC KHI CẬP NHẬT STATE LỖI ===
                if (isMounted.current) {
                    setError(`Thêm sản phẩm thất bại: ${errorData.message || 'Lỗi không xác định'}`);
                }
            }
        } catch (err) {
            console.error(err);
            // === BƯỚC 4: KIỂM TRA isMounted TRƯỚC KHI CẬP NHẬT STATE LỖI ===
            if (isMounted.current) {
                setError('Đã có lỗi xảy ra khi thêm sản phẩm.');
            }
        } finally {
            // === BƯỚC 4: KIỂM TRA isMounted TRƯỚC KHI CẬP NHẬT STATE LOADING ===
            // Đây là nơi quan trọng nhất gây ra warning, vì nó luôn chạy sau khi request kết thúc,
            // kể cả khi đã navigate() thành công.
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    };

    const renderSpecificFields = () => {
        // ... (Nội dung hàm này không thay đổi)
        switch (productType) {
            case 'cd':
                return (
                    <>
                        <input name="artist" value={formData.artist || ''} onChange={handleChange} placeholder="Artist" className="form-control mb-2" />
                        <input name="recordLabel" value={formData.recordLabel || ''} onChange={handleChange} placeholder="Record Label" className="form-control mb-2" />
                        <input name="musicType" value={formData.musicType || ''} onChange={handleChange} placeholder="Music Type" className="form-control mb-2" />
                        <input type="date" name="releasedDate" value={formData.releasedDate || ''} onChange={handleChange} className="form-control mb-2" />
                    </>
                );
            case 'book':
                return (
                    <>
                        <input name="author" value={formData.author || ''} onChange={handleChange} placeholder="Author" className="form-control mb-2" />
                        <input name="coverType" value={formData.coverType || ''} onChange={handleChange} placeholder="Cover Type" className="form-control mb-2" />
                        <input name="publisher" value={formData.publisher || ''} onChange={handleChange} placeholder="Publisher" className="form-control mb-2" />
                        <input type="date" name="publishDate" value={formData.publishDate || ''} onChange={handleChange} className="form-control mb-2" />
                        <input type="number" name="numOfPages" value={formData.numOfPages || ''} onChange={handleChange} placeholder="Number of Pages" className="form-control mb-2" />
                        <input name="language" value={formData.language || ''} onChange={handleChange} placeholder="Language" className="form-control mb-2" />
                        <input name="bookCategory" value={(formData.bookCategory || []).join(',')} onChange={handleChange} placeholder="Book Categories (comma separated)" className="form-control mb-2" />
                    </>
                );
            case 'dvd':
                return (
                    <>
                        <input name="discType" value={formData.discType || ''} onChange={handleChange} placeholder="Disc Type" className="form-control mb-2" />
                        <input name="director" value={formData.director || ''} onChange={handleChange} placeholder="Director" className="form-control mb-2" />
                        <input name="duration" value={formData.duration || ''} onChange={handleChange} placeholder="Duration" className="form-control mb-2" />
                        <input name="language" value={formData.language || ''} onChange={handleChange} placeholder="Language" className="form-control mb-2" />
                        <input name="subtitles" value={formData.subtitles || ''} onChange={handleChange} placeholder="Subtitles" className="form-control mb-2" />
                        <input type="date" name="releasedDate" value={formData.releasedDate || ''} onChange={handleChange} className="form-control mb-2" />
                        <input name="filmType" value={formData.filmType || ''} onChange={handleChange} placeholder="Film Type" className="form-control mb-2" />
                    </>
                );
            default: return null;
        }
    };

    return (
        <div className="container mt-4">
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit}>
                <select name="productType" value={productType} onChange={handleTypeChange} className="form-select mb-3" disabled={isLoading}>
                    <option value="cd">CD</option>
                    <option value="book">Book</option>
                    <option value="dvd">DVD</option>
                </select>

                <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="Product Title" className="form-control mb-2" required disabled={isLoading} />
                <input type="number" name="price" value={formData.price || ''} onChange={handleChange} placeholder="Price" className="form-control mb-2" required disabled={isLoading}/>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" className="form-control mb-2" disabled={isLoading}/>
                <input type="number" name="quantity" value={formData.quantity || 1} onChange={handleChange} placeholder="Quantity" className="form-control mb-2" disabled={isLoading}/>
                <input name="weight" value={formData.weight || ''} onChange={handleChange} placeholder="Weight" className="form-control mb-2" disabled={isLoading}/>
                <div className="form-check mb-2">
                    <input id="rushDeliverySupport" className="form-check-input" type="checkbox" name="rushDeliverySupport" checked={formData.rushDeliverySupport || false} onChange={handleChange} disabled={isLoading}/>
                    <label htmlFor="rushDeliverySupport" className="form-check-label">Rush Delivery Support</label>
                </div>
                
                <div className="mt-3 mb-3">
                    <label>Product Image</label>
                    <input type="file" onChange={handleImageChange} className="form-control" accept="image/*" required disabled={isLoading}/>
                </div>

                {renderSpecificFields()}
                
                {error && <div className="alert alert-danger mt-3">{error}</div>}

                <button type="submit" className="btn btn-primary mt-3" disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'Thêm sản phẩm'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;