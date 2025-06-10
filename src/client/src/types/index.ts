type MediaItem = {
    id: string;
    imageUrl: string;
    title: string;
    price: number | string;
    description?: string;
    category: string;
    quantity: number;
    weight: string;
    dimension?: string;
    rushDeliverySupport: boolean;

    // CD specific fields (optional)
    artist?: string;
    recordLabel?: string;
    musicType?: string;
    releasedDate?: string; // ISO string hoặc Date nếu bạn parse

    // Book specific fields (optional)
    author?: string;
    coverType?: string;
    publisher?: string;
    publishDate?: string; // ISO string hoặc Date nếu bạn parse
    numOfPages?: number;
    language?: string;
    bookCategory?: string;

    // DVD specific fields (optional)
    discType?: string;
    director?: string;
    duration?: string;
    subtitles?: string;
    filmType?: string;
};

type CartItem = {
    product: MediaItem;
    quantity: number;
};

type Cart = {
    id: string;
    listCartItem: CartItem[];
    totalPrice: number;
};


export type { MediaItem, CartItem, Cart };

