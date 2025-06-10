import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Home.css'; // Optional: your custom styles
import { MediaItem } from '../types';
import { getOrCreateCartId } from '../utils/cartId';

const Home: React.FC = () => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/api/product/all')
            .then(res => res.json())
            .then(data => setMediaItems(data.data))
            .catch(err => console.error('Failed to fetch media items:', err));
    }, []);

    const handleCardClick = (id: string) => {
        navigate(`/product/${id}`);
    };

    const handleAddToCart = async (id: string) => {
        const cartId = await getOrCreateCartId();
        const params = new URLSearchParams({
            productId: id,
            quantity: "1",
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

    return (
        <main>
            <div className="container py-4">
                <div className="row row-cols-1 row-cols-2 row-cols-3 row-cols-4 row-cols-5 g-4">
                    {mediaItems.map((item, idx) => (
                        <div className="col" key={idx}>
                            <div className="card shadow-sm h-100">
                                <img
                                    src={item.imageUrl}
                                    className="card-img-top"
                                    alt={item.title}
                                    style={{ height: 225, objectFit: 'cover', cursor: 'pointer' }}
                                    onClick={() => handleCardClick(item.id)}
                                />
                                <div className="card-body">
                                    <h5 className="card-title" style={{ cursor: 'pointer' }} onClick={() => handleCardClick(item.id)}>{item.title}</h5>
                                    <p className="card-text">${item.price}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => handleAddToCart(item.id)}>
                                            ADD TO CART
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Home;