import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MediaItem } from '../types';

import { useAuth } from '../contexts/AuthContext';

type MediaShopResponse<T> = { code: number; message: string; data?: T; };

// handleApiResponse to handle responses with no body (common with DELETE)
async function handleApiResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) { // 204 No Content is a success
        return undefined as T;
    }
    const text = await response.text();
    if (!text) { // Handle empty body but status is not 204
        
        if (response.ok) return undefined as T;
        throw new Error('Server returned an empty response.');
    }
    const json: MediaShopResponse<T> = JSON.parse(text);
    if (!response.ok || (json.code && json.code !== 1)) {
        throw new Error(json.message || 'Server error');
    }
    return json.data as T;
}

const getAllProducts = (userId: string): Promise<MediaItem[]> => {
    return fetch(`http://localhost:8080/api/ProductManager/products?userId=${userId}`).then(res => handleApiResponse<MediaItem[]>(res));
};

//  Delete product function to send userId
const deleteProductById = (productId: string, userId: string): Promise<void> => {
    // URL matches backend: /delete/{id}?userId=...
    return fetch(`http://localhost:8080/api/ProductManager/delete/${productId}?userId=${userId}`, {
        method: 'DELETE',
    }).then(res => handleApiResponse<void>(res));
};

// API function to delete multiple products, more efficient
const deleteListProduct = (productIds: string[], userId: string): Promise<void> => {
    const params = new URLSearchParams();
    params.append('userId', userId);
    productIds.forEach(id => params.append('ids', id));
    
    return fetch(`http://localhost:8080/api/ProductManager/delete-list?${params.toString()}`, {
        method: 'DELETE',
    }).then(res => handleApiResponse<void>(res));
};


// --- REACT COMPONENT ---
const ProductList: React.FC = () => {
    const { currentUser } = useAuth(); // currentUser now has type User | null
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
        setSelectedProducts(prevSelected =>
            prevSelected.includes(productId)
                ? prevSelected.filter(id => id !== productId)
                : [...prevSelected, productId]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedProducts(products.map(p => p.id));
        } else {
            setSelectedProducts([]);
        }
    };
    
    // Delete logic to pass userId
    const handleDeleteProduct = async (productId: string, productTitle: string) => {
        if (!currentUser?.id) {
            setError("Cannot find the user information for this action.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete "${productTitle}"?`)) {
            try {
                await deleteProductById(productId, currentUser.id);
                setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
                setError(null); // Clear old error if successful
            } catch (err: any) {
                setError(`Error deleting product: ${err.message}`);
            }
        }
    };

    // Bulk delete logic to call new efficient API
    const handleDeleteSelected = async () => {
        if (!currentUser?.id) {
            setError("Cannot find user information to perform this action.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} selected products?`)) {
            try {
                // Only call API once
                await deleteListProduct(selectedProducts, currentUser.id);
                setProducts(prevProducts => prevProducts.filter(p => !selectedProducts.includes(p.id)));
                setSelectedProducts([]);
                setError(null); // Clear old error if successful
            } catch (err: any) {
                setError(`Error deleting selected products: ${err.message}`);
            }
        }
    }

    if (!currentUser || currentUser.role !== 'Product Manager') {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning">
                    <h2>Access Denied</h2>
                    <p>Please <Link to="/login">login</Link> with the Product Manager account.</p>
                </div>
            </div>
        );
    }

    if (isLoading) return <div className="container mt-4"><h2>Loading...</h2></div>;
    
    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Products</h1>
                <div>
                    {selectedProducts.length > 0 && (
                        <button className="btn btn-danger me-2" onClick={handleDeleteSelected}>
                            Delete {selectedProducts.length} Products
                        </button>
                    )}
                    <Link to="/api/ProductManager/add-product" className="btn btn-success">
                        Add New Product
                    </Link>
                </div>
            </div>
            
            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            {products.length === 0 ? (
                <div className="alert alert-info">No products available.</div>
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
                            <th scope="col" style={{ width: '10%' }}>Image</th>
                            <th scope="col">Title</th>
                            <th scope="col">Type</th>
                            <th scope="col">Price</th>
                            <th scope="col" style={{ width: '20%' }} className="text-center">Actions</th>
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
                                                alt={product.title || 'Product'}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                        </Link>
                                    </td>
                                    <td className="fw-bold">
                                        <Link to={`/product/${product.id}`} className="text-dark text-decoration-none">
                                            {product.title || 'No title'}
                                        </Link>
                                    </td>
                                    <td>
                                        <span className="badge bg-secondary">
                                            {(product.productType || 'N/A').toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{Number(product.price || 0).toLocaleString('en-US')} đ</td>
                                    <td className="text-center">
                                        <Link
                                            to={`/api/ProductManager/update-product/${product.id}`}
                                            className="btn btn-primary btn-sm me-2"
                                        >
                                            Update
                                        </Link>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteProduct(product.id, product.title)}
                                        >
                                            Delete
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