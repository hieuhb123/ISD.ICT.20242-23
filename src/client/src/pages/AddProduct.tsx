import React, { useState } from 'react';
import { MediaItem } from '../types';

const initialFormState: Partial<MediaItem> = {
    title: '',
    price: '',
    description: '',
    quantity: 1,
    weight: '',
    rushDeliverySupport: false,
    isDeleted: false,
    // CD
    artist: '',
    recordLabel: '',
    musicType: '',
    releasedDate: '',
    // Book
    author: '',
    coverType: '',
    publisher: '',
    publishDate: '',
    numOfPages: undefined,
    language: '',
    bookCategory: [],
    // DVD
    discType: '',
    director: '',
    duration: '',
    subtitles: '',
    filmType: '',
};

const AddProduct: React.FC = () => {
    const [productType, setProductType] = useState<'cd' | 'book' | 'dvd'>('cd');
    const [formData, setFormData] = useState<Partial<MediaItem>>(initialFormState);
    const [userId, setUserId] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

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

        if (!userId.trim()) return alert('Please enter the Manager User ID.');
        if (!imageFile) return alert('Please select an image for the product.');

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
            const url = `http://localhost:8080/api/ProductManager/add-${productType}?userId=${encodeURIComponent(userId)}`;
            const response = await fetch(url, {
                method: 'POST',
                body: submissionFormData,
            });

            if (response.ok) {
                alert('Product added successfully!');
                setFormData(initialFormState);
                setImageFile(null);
                setUserId('');
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            } else {
                const errorData = await response.json();
                alert(`Failed to add product: ${errorData.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred while adding the product.');
        }
    };

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
                <input name="userId" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Manager User ID" className="form-control mb-3" required />
                <select name="productType" value={productType} onChange={handleTypeChange} className="form-select mb-3">
                    <option value="cd">CD</option>
                    <option value="book">Book</option>
                    <option value="dvd">DVD</option>
                </select>

                <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="Product Title" className="form-control mb-2" required />
                <input type="number" name="price" value={formData.price || ''} onChange={handleChange} placeholder="Price" className="form-control mb-2" required />
                <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" className="form-control mb-2" />
                <input type="number" name="quantity" value={formData.quantity || 1} onChange={handleChange} placeholder="Quantity" className="form-control mb-2" />
                <input name="weight" value={formData.weight || ''} onChange={handleChange} placeholder="Weight" className="form-control mb-2" />
                <input type="checkbox" name="rushDeliverySupport" checked={formData.rushDeliverySupport || false} onChange={handleChange} /> Rush Delivery Support

                <div className="mt-3 mb-3">
                    <label>Product Image</label>
                    <input type="file" onChange={handleImageChange} className="form-control" accept="image/*" required />
                </div>

                {renderSpecificFields()}
                <button type="submit" className="btn btn-primary mt-3">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
