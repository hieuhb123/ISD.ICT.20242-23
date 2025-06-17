import React, { useState } from 'react';

// Định nghĩa kiểu dữ liệu cho state (không thay đổi)
interface ProductState {
    name: string;
    price: string;
    description: string;
    // CD fields
    artist?: string;
    recordLabel?: string;
    musicType?: string;
    releasedDate?: string;
    // Book fields
    author?: string;
    coverType?: string;
    publisher?: string;
    publishDate?: string;
    numOfPages?: string;
    language?: string;
    bookCategory?: string;
    // DVD fields
    discType?: string;
    director?: string;
    duration?: string;
    subtitles?: string;
    filmType?: string;
}

// Giá trị khởi tạo cho form (bỏ trường 'image')
const initialFormState: ProductState = {
    name: '',
    price: '',
    description: '',
    artist: '',
    recordLabel: '',
    musicType: '',
    releasedDate: '',
    author: '',
    coverType: '',
    publisher: '',
    publishDate: '',
    numOfPages: '',
    language: '',
    bookCategory: '',
    discType: '',
    director: '',
    duration: '',
    subtitles: '',
    filmType: '',
};

const AddProduct: React.FC = () => {
    const [productType, setProductType] = useState<'cd' | 'book' | 'dvd'>('cd');
    const [formData, setFormData] = useState<ProductState>(initialFormState);
    const [userId, setUserId] = useState('');
    
    // --- THAY ĐỔI: Thêm state để lưu file hình ảnh ---
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Hàm `handleChange` cho các trường text, select
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- THAY ĐỔI: Thêm hàm xử lý khi người dùng chọn file ảnh ---
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as 'cd' | 'book' | 'dvd';
        setProductType(newType);
        setFormData(initialFormState); // Reset form khi đổi loại sản phẩm
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!userId.trim()) {
            alert('Please enter the Manager User ID.');
            return;
        }
        if (!imageFile) {
            alert('Please select an image for the product.');
            return;
        }

        // 1. Chuẩn bị dữ liệu sản phẩm (product data) để chuyển thành JSON
        const productData: any = {
            name: formData.name,
            price: parseFloat(formData.price) || 0,
            description: formData.description,
        };
        
        // Thêm các trường dữ liệu riêng tùy theo loại sản phẩm
        switch (productType) {
            case 'cd':
                productData.artist = formData.artist;
                productData.recordLabel = formData.recordLabel;
                productData.musicType = formData.musicType;
                productData.releasedDate = formData.releasedDate;
                break;
            case 'book':
                productData.author = formData.author;
                productData.coverType = formData.coverType;
                productData.publisher = formData.publisher;
                productData.publishDate = formData.publishDate;
                productData.numOfPages = parseInt(formData.numOfPages || '0');
                productData.language = formData.language;
                productData.bookCategory = formData.bookCategory;
                break;
            case 'dvd':
                productData.discType = formData.discType;
                productData.director = formData.director;
                productData.duration = formData.duration;
                productData.language = formData.language;
                productData.subtitles = formData.subtitles;
                productData.releasedDate = formData.releasedDate;
                productData.filmType = formData.filmType;
                break;
        }

        // 2. Tạo đối tượng FormData để gửi đi
        const submissionFormData = new FormData();

        // Thêm dữ liệu sản phẩm dưới dạng một 'part' JSON
        submissionFormData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
        
        // Thêm file hình ảnh dưới dạng một 'part' file
        submissionFormData.append('image', imageFile);

        const url = `/api/ProductManager/add-${productType}?userId=${encodeURIComponent(userId)}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                // Quan trọng: KHÔNG set header 'Content-Type'.
                // Trình duyệt sẽ tự động làm điều đó và thêm 'boundary' cần thiết.
                body: submissionFormData, 
            });

            if (response.ok) {
                alert('Product added successfully!');
                setFormData(initialFormState); 
                setImageFile(null); // Reset cả file ảnh
                setUserId(''); // Reset cả userId
                // Reset giá trị của input file
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if(fileInput) fileInput.value = '';
            } else {
                const errorData = await response.json();
                alert(`Failed to add product: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('An error occurred while adding the product.');
        }
    };

    const renderSpecificFields = () => {
        switch (productType) {
            case 'cd':
                return (
                    <>
                        <div className="mb-3"><label className="form-label">Artist</label><input type="text" className="form-control" name="artist" value={formData.artist} onChange={handleChange} required /></div>
                        <div className="mb-3"><label className="form-label">Record Label</label><input type="text" className="form-control" name="recordLabel" value={formData.recordLabel} onChange={handleChange} /></div>
                        <div className="mb-3"><label className="form-label">Music Type</label><input type="text" className="form-control" name="musicType" value={formData.musicType} onChange={handleChange} /></div>
                        <div className="mb-3"><label className="form-label">Released Date</label><input type="date" className="form-control" name="releasedDate" value={formData.releasedDate} onChange={handleChange} /></div>
                    </>
                );
            case 'book':
                return (
                    <>
                        <div className="mb-3"><label className="form-label">Author</label><input type="text" className="form-control" name="author" value={formData.author} onChange={handleChange} required /></div>
                        <div className="mb-3"><label className="form-label">Cover Type</label><input type="text" className="form-control" name="coverType" value={formData.coverType} onChange={handleChange} /></div>
                        <div className="mb-3"><label className="form-label">Publisher</label><input type="text" className="form-control" name="publisher" value={formData.publisher} onChange={handleChange} /></div>
                        <div className="mb-3"><label className="form-label">Publish Date</label><input type="date" className="form-control" name="publishDate" value={formData.publishDate} onChange={handleChange} /></div>
                        <div className="mb-3"><label className="form-label">Number of Pages</label><input type="number" className="form-control" name="numOfPages" value={formData.numOfPages} onChange={handleChange} required /></div>
                        <div className="mb-3"><label className="form-label">Language</label><input type="text" className="form-control" name="language" value={formData.language} onChange={handleChange} /></div>
                        <div className="mb-3"><label className="form-label">Book Category</label><input type="text" className="form-control" name="bookCategory" value={formData.bookCategory} onChange={handleChange} /></div>
                    </>
                );
            case 'dvd':
                return (
                    <>
                        <div className="mb-3"><label className="form-label">Disc Type</label><input type="text" className="form-control" name="discType" value={formData.discType} onChange={handleChange} /></div>
                        <div className="mb-3"><label className="form-label">Director</label><input type="text" className="form-control" name="director" value={formData.director} onChange={handleChange} /></div>
                        <div className="mb-3"><label className="form-label">Duration</label><input type="text" className="form-control" name="duration" value={formData.duration} onChange={handleChange} /></div>
                        <div className="mb-3"><label className="form-label">Language</label><input type="text" className="form-control" name="language" value={formData.language} onChange={handleChange} /></div>
                        <div className="mb-3"><label className="form-label">Subtitles</label><input type="text" className="form-control" name="subtitles" value={formData.subtitles} onChange={handleChange} /></div>
                        <div className="mb-3"><label className="form-label">Released Date</label><input type="date" className="form-control" name="releasedDate" value={formData.releasedDate} onChange={handleChange} /></div>
                        <div className="mb-3"><label className="form-label">Film Type</label><input type="text" className="form-control" name="filmType" value={formData.filmType} onChange={handleChange} /></div>
                    </>
                );
            default: return null;
        }
    };

    return (
        <div className="container mt-4">
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label fw-bold">Manager User ID</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={userId} 
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter the manager's user ID here"
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Product Type</label>
                    <select className="form-select" name="productType" value={productType} onChange={handleTypeChange}>
                        <option value="cd">CD</option>
                        <option value="book">Book</option>
                        <option value="dvd">DVD</option>
                    </select>
                </div>
                <hr/>
                {/* --- Common Fields --- */}
                <div className="mb-3"><label className="form-label">Name</label><input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required /></div>
                <div className="mb-3"><label className="form-label">Price</label><input type="number" step="1000" className="form-control" name="price" value={formData.price} onChange={handleChange} required /></div>
                <div className="mb-3"><label className="form-label">Description</label><textarea className="form-control" name="description" value={formData.description} onChange={handleChange}></textarea></div>
                
                <div className="mb-3">
                    <label className="form-label">Product Image</label>
                    <input type="file" className="form-control" name="image" onChange={handleImageChange} required accept="image/*" />
                </div>
                
                <hr />
                {/* --- Dynamic Fields Rendered Here --- */}
                {renderSpecificFields()}
                
                <button type="submit" className="btn btn-primary mt-3 mb-5">Add Product</button>
            </form>
        </div>
    );
}

export default AddProduct;