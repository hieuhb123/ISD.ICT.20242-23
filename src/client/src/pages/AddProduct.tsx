import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate để điều hướng sau khi thành công
import { MediaItem } from '../types';
// === BƯỚC 1: IMPORT USEAUTH ===
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
    // === BƯỚC 2: LẤY CURRENTUSER TỪ CONTEXT ===
    const { currentUser } = useAuth(); 
    const navigate = useNavigate(); // Hook để điều hướng

    const [productType, setProductType] = useState<'cd' | 'book' | 'dvd'>('cd');
    const [formData, setFormData] = useState<Partial<MediaItem>>(initialFormState);
    // === BƯỚC 3: XÓA STATE CỤC BỘ CỦA USERID ===
    // const [userId, setUserId] = useState(''); // Không cần dòng này nữa
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Thêm state cho loading
    const [error, setError] = useState(''); // Thêm state cho lỗi

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
        setError('');
        setIsLoading(true);

        // === BƯỚC 4: SỬ DỤNG CURRENTUSER.ID THAY VÌ STATE CỤC BỘ ===
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
            // Sử dụng currentUser.id trong URL
            const url = `http://localhost:8080/apt/ProductManager/add-${productType}?userId=${encodeURIComponent(currentUser.id)}`;
            const response = await fetch(url, {
                method: 'POST',
                body: submissionFormData,
            });

            if (response.ok) {
                alert('Thêm sản phẩm thành công!');
                // Điều hướng về trang danh sách sản phẩm
                navigate('/apt/ProductManager/list-product');
            } else {
                const errorData = await response.json();
                setError(`Thêm sản phẩm thất bại: ${errorData.message || 'Lỗi không xác định'}`);
            }
        } catch (err) {
            console.error(err);
            setError('Đã có lỗi xảy ra khi thêm sản phẩm.');
        } finally {
            setIsLoading(false);
        }
    };

    // Phần render các trường riêng cho từng loại sản phẩm (giữ nguyên)
    const renderSpecificFields = () => {
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
                {/* === BƯỚC 5: XÓA TRƯỜNG INPUT USERID KHỎI FORM === */}
                {/* <input name="userId" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Manager User ID" className="form-control mb-3" required /> */}
                
                <select name="productType" value={productType} onChange={handleTypeChange} className="form-select mb-3" disabled={isLoading}>
                    <option value="cd">CD</option>
                    <option value="book">Book</option>
                    <option value="dvd">DVD</option>
                </select>

                <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="Product Title" className="form-control mb-2" required disabled={isLoading} />
                <input type="number" name="price" value={formData.price || ''} onChange={handleChange} placeholder="Price" className="form-control mb-2" required disabled={isLoading}/>
                {/* ... các trường input khác ... */}
                
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
