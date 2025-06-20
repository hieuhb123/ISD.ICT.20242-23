type MediaItem = {
    id: string;
    imageURL: string;
    title: string;
    price: number | string;
    description?: string;
    productType: string;
    quantity: number;
    weight: string;
    dimension?: string;
    rushDeliverySupport: boolean;
    isDeleted: boolean;

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
    bookCategory?: string[];

    // DVD specific fields (optional)
    discType?: string;
    director?: string;
    duration?: string;
    subtitles?: string;
    filmType?: string;
};

type CartItem = {
    product: MediaItem;
    statusCode: number; 
    quantity: number;
};

type OrderItem = {
    productId: String;
    quantity: number;
};

type Order = {
    orderId?: string; // Có thể có nếu server trả về
    userId: string;
    shippingAddress: string;
    items: OrderItem[];
    createdAt?: string;  
};

export type { MediaItem, CartItem , OrderItem, Order };

