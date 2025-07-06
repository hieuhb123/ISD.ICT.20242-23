
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

const BOOK_CATEGORIES = ["Books", "Biographies & Memoirs", "Leaders & Notable People"];

const AddProduct: React.FC = () => {
    // ... states and hooks 
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [productType, setProductType] = useState<'cd' | 'book' | 'dvd'>('cd');
    const [formData, setFormData] = useState<Partial<MediaItem>>(initialFormState);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'checkbox' && e.target instanceof HTMLInputElement
            ? e.target.checked
            : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    // === CHANGE 1: NEW HANDLER FOR CHECKBOX ===
    // This function adds or removes a category from the bookCategory array
    const handleCategoryCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentCategories = prev.bookCategory || [];
            if (checked) {
                // If checked, add category to array (if not already present)
                return { ...prev, bookCategory: [...currentCategories, value] };
            } else {
                // If unchecked, remove category from array
                return { ...prev, bookCategory: currentCategories.filter(category => category !== value) };
            }
        });
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

        if (!currentUser?.id) {
            setError('Manager information not found. Please log in again.');
            setIsLoading(false);
            return;
        }
        if (!imageFile) {
            setError('Please select an image for the product.');
            setIsLoading(false);
            return;
        }

        const productData: Partial<MediaItem> = {
            ...formData,
            productType,
            price: parseFloat(String(formData.price)) || 0,
            numOfPages: formData.numOfPages ? parseInt(String(formData.numOfPages)) : undefined,
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
            
            if (!isMounted.current) return; 

            if (response.ok) {
                alert('Product added successfully!');
                navigate('/api/ProductManager/list-product');
            } else {
                const errorData = await response.json();
                setError(`Failed to add product: ${errorData.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(err);
            if (isMounted.current) {
                setError('An error occurred while adding the product.');
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
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
                // === CHANGE 2: UPDATE UI TO USE CHECKBOXES ===
                return (
                    <>
                        <input name="author" value={formData.author || ''} onChange={handleChange} placeholder="Author" className="form-control mb-2" />
                        <input name="coverType" value={formData.coverType || ''} onChange={handleChange} placeholder="Cover Type" className="form-control mb-2" />
                        <input name="publisher" value={formData.publisher || ''} onChange={handleChange} placeholder="Publisher" className="form-control mb-2" />
                        <input type="date" name="publishDate" value={formData.publishDate || ''} onChange={handleChange} className="form-control mb-2" />
                        <input type="number" name="numOfPages" value={formData.numOfPages || ''} onChange={handleChange} placeholder="Number of Pages" className="form-control mb-2" />
                        <input name="language" value={formData.language || ''} onChange={handleChange} placeholder="Language" className="form-control mb-2" />

                        <div className="mt-3">
                            <label className="form-label">Book Categories:</label>
                            {BOOK_CATEGORIES.map(category => (
                                <div className="form-check" key={category}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`category-${category}`}
                                        value={category}
                                        // Check if checkbox should be checked
                                        checked={(formData.bookCategory || []).includes(category)}
                                        // Use new handler
                                        onChange={handleCategoryCheckboxChange}
                                    />
                                    <label className="form-check-label" htmlFor={`category-${category}`}>
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>
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
                <label>Quantity</label><input type="number" name="quantity" value={formData.quantity || 1} onChange={handleChange} placeholder="Quantity" className="form-control mb-2" disabled={isLoading}/>
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
                    {isLoading ? 'Processing...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
