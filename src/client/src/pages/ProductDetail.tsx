import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MediaItem } from '../types';
import { getOrCreateCartId } from '../utils/cartId';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<MediaItem | null>(null);
    const [amount, setAmount] = useState<number>(1);

    useEffect(() => {
        fetch(`http://localhost:8080/api/product/${id}`)
            .then(res => res.json())
            .then(data => {
                setItem(data.data);
                console.log('Fetched item:', data.data);   
            })
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
    
    function formatDate(dateStr?: string) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-US');
    }
    
    if (!item) return <div>Loading...</div>;

    return (
        <div className="container py-4">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{item.title}</li>
                </ol>
            </nav>
            <div className="row">
                {/* Left: Product Images */}
                <div className="col-md-5">
                    <img src={item.imageURL} className="img-fluid border mb-2" alt={item.title} style={{ maxHeight: 400, objectFit: 'contain' }} />
                </div>
                {/* Right: Product Info */}
                <div className="col-md-7">
                    <h3>{item.title}</h3>
                    <div className="mb-2">
                        <span className="fs-4 text-danger fw-bold">{item.price.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="mb-2">
                        <span className="badge bg-secondary">{item.productType}</span>
                    </div>
                    <div className="mb-3">
                        <label className="me-2">Quantity:</label>
                        <input
                            type="number"
                            min={1}
                            max={item.quantity}
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            style={{ width: 70, display: 'inline-block' }}
                            className="form-control d-inline-block me-2"
                        />
                        <button className="btn btn-danger" onClick={handleAddToCart}>Add to Cart</button>
                    </div>
                    <div className="mb-2">
                        <span>Stock Available: {item.quantity}</span>
                    </div>
                </div>
            </div>
            {/* Product Detail Section */}
            <div className="row mt-4">
                <div className="col-md-8">
                    <div className="bg-white p-3 rounded shadow-sm mb-3">
                        <h5 className="mb-3">PRODUCT DETAILS</h5>
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td className="text-muted" style={{ width: 200 }}>Category</td>
                                    <td>{item.productType}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Stock Available</td>
                                    <td>{item.quantity}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Weight</td>
                                    <td>{item.weight}</td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Rush Delivery Support</td>
                                    <td>{item.rushDeliverySupport ? 'Yes' : 'No'}</td>
                                </tr>
                                {item.dimension && (
                                    <tr>
                                        <td className="text-muted">Dimensions (L x W x H)</td>
                                        <td>{item.dimension}</td>
                                    </tr>
                                )}

                                {/* CD fields */}
                                {item.artist && (
                                    <tr>
                                        <td className="text-muted">Artist</td>
                                        <td>{item.artist}</td>
                                    </tr>
                                )}
                                {item.recordLabel && (
                                    <tr>
                                        <td className="text-muted">Record Label</td>
                                        <td>{item.recordLabel}</td>
                                    </tr>
                                )}
                                {item.musicType && (
                                    <tr>
                                        <td className="text-muted">Music Genre</td>
                                        <td>{item.musicType}</td>
                                    </tr>
                                )}
                                {item.releasedDate && (
                                    <tr>
                                        <td className="text-muted">Release Date</td>
                                        <td>{formatDate(item.releasedDate)}</td>
                                    </tr>
                                )}

                                {/* Book fields */}
                                {item.author && (
                                    <tr>
                                        <td className="text-muted">Author</td>
                                        <td>{item.author}</td>
                                    </tr>
                                )}
                                {item.coverType && (
                                    <tr>
                                        <td className="text-muted">Cover Type</td>
                                        <td>{item.coverType}</td>
                                    </tr>
                                )}
                                {item.publisher && (
                                    <tr>
                                        <td className="text-muted">Publisher</td>
                                        <td>{item.publisher}</td>
                                    </tr>
                                )}
                                {item.publishDate && (
                                    <tr>
                                        <td className="text-muted">Publish Date</td>
                                        <td>{formatDate(item.publishDate)}</td>
                                    </tr>
                                )}
                                {item.numOfPages && (
                                    <tr>
                                        <td className="text-muted">Number of Pages</td>
                                        <td>{item.numOfPages}</td>
                                    </tr>
                                )}
                                {item.language && (
                                    <tr>
                                        <td className="text-muted">Language</td>
                                        <td>{item.language}</td>
                                    </tr>
                                )}
                                {item.bookCategory && item.bookCategory.length > 0 && (
                                    <tr>
                                        <td className="text-muted">Book Categories</td>
                                        <td>{item.bookCategory.join(', ')}</td>
                                    </tr>
                                )}

                                {/* DVD fields */}
                                {item.discType && (
                                    <tr>
                                        <td className="text-muted">Disc Type</td>
                                        <td>{item.discType}</td>
                                    </tr>
                                )}
                                {item.director && (
                                    <tr>
                                        <td className="text-muted">Director</td>
                                        <td>{item.director}</td>
                                    </tr>
                                )}
                                {item.duration && (
                                    <tr>
                                        <td className="text-muted">Duration</td>
                                        <td>{item.duration}</td>
                                    </tr>
                                )}
                                {item.subtitles && (
                                    <tr>
                                        <td className="text-muted">Subtitles</td>
                                        <td>{item.subtitles}</td>
                                    </tr>
                                )}
                                {item.filmType && (
                                    <tr>
                                        <td className="text-muted">Film Genre</td>
                                        <td>{item.filmType}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                        <h5 className="mb-3">PRODUCT DESCRIPTION</h5>
                        <div style={{ whiteSpace: 'pre-line' }}>
                            {item.description || 'No description available.'}
                        </div>
                    </div>
                </div>
                {/* Sidebar: Could add vouchers, featured products, etc. */}
                <div className="col-md-4">
                    {/* ... */}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;