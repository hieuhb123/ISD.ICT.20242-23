import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MediaItem } from '../types';
import { getOrCreateCartId } from '../utils/cartId';

const renderCategoryDetails = (item: any) => {
    switch (item.category) {
        case 'book':
            return (
                <div>
                    <p><strong>Author:</strong> {item.author}</p>
                    <p><strong>Cover Type:</strong> {item.coverType}</p>
                    <p><strong>Publisher:</strong> {item.publisher}</p>
                    <p><strong>Publish Date:</strong> {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : ''}</p>
                    <p><strong>Pages:</strong> {item.numOfPages}</p>
                    <p><strong>Language:</strong> {item.language}</p>
                    <p><strong>Book Category:</strong> {item.bookCategory}</p>
                </div>
            );
        case 'cd':
            return (
                <div>
                    <p><strong>Artist:</strong> {item.artist}</p>
                    <p><strong>Record Label:</strong> {item.recordLabel}</p>
                    <p><strong>Music Type:</strong> {item.musicType}</p>
                    <p><strong>Released Date:</strong> {item.releasedDate ? new Date(item.releasedDate).toLocaleDateString() : ''}</p>
                </div>
            );
        case 'dvd':
            return (
                <div>
                    <p><strong>Disc Type:</strong> {item.discType}</p>
                    <p><strong>Director:</strong> {item.director}</p>
                    <p><strong>Duration:</strong> {item.duration}</p>
                    <p><strong>Language:</strong> {item.language}</p>
                    <p><strong>Subtitles:</strong> {item.subtitles}</p>
                    <p><strong>Released Date:</strong> {item.releasedDate ? new Date(item.releasedDate).toLocaleDateString() : ''}</p>
                    <p><strong>Film Type:</strong> {item.filmType}</p>
                </div>
            );
        default:
            return <div>No additional info.</div>;
    }
};

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<MediaItem | null>(null);
    const [activeTab, setActiveTab] = useState<'description' | 'other'>('description');
    const [amount, setAmount] = useState<number>(1);

    useEffect(() => {
        fetch(`http://localhost:8080/api/product/${id}`)
            .then(res => res.json())
            .then(data => setItem(data.data))
            .catch(err => console.error('Failed to fetch item info:', err));
    }, [id]);

    const handleAddToCart = async () => {
        if (!item) return;
        const cartId = await getOrCreateCartId();
        const params = new URLSearchParams({
            productId: item.id,
            quantity: amount.toString(),
        });
        const res = await fetch(`http://localhost:8080/api/cart/${cartId}/add?${params.toString()}`, {
            method: 'POST',
        });
        if (res.ok) {
            alert('Added to cart!');
        } else {
            alert('Failed to add to cart!');
        }
    };

    if (!item) return <div>Loading...</div>;

    return (
        <div className="container py-4">
            <Link to="/">← Back to Home</Link>
            <div className="row mt-3">
                <div className="col-md-6 d-flex justify-content-center align-items-start">
                    <img src={item.imageURL} className="img-fluid" alt={item.title} style={{ maxHeight: 450, objectFit: 'contain' }} />
                </div>
                <div className="col-md-6">
                    <h2>{item.title}</h2>
                    <div className="mb-2"><strong>${item.price}</strong></div>
                    <div className="mb-3 d-flex align-items-center">
                        <label className="me-2 mb-0" htmlFor="amount">Amount:</label>
                        <input
                            id="amount"
                            type="number"
                            min={1}
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            style={{ width: 70 }}
                            className="form-control d-inline-block me-2"
                        />
                        <button className="btn btn-danger" onClick={handleAddToCart}>ADD TO CART</button>
                    </div>
                    <div>
                        <span className="badge bg-secondary me-2">{item.category}</span>
                    </div>
                </div>
            </div>
            {/* Tabs */}
            <div className="mt-5">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'other' ? 'active' : ''}`}
                            onClick={() => setActiveTab('other')}
                        >
                            Additional Info
                        </button>
                    </li>
                </ul>
                <div className="tab-content border border-top-0 p-3 bg-light">
                    {activeTab === 'description' && (
                        <div>
                            <h5>Description</h5>
                            <p>{item.description || 'No description available.'}</p>
                        </div>
                    )}
                    {activeTab === 'other' && (
                        <div>
                            <h5>Additional Info</h5>
                            {renderCategoryDetails(item)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;