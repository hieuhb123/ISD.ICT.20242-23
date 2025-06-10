export async function getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
        const res = await fetch('http://localhost:8080/api/cart/new');
        const data = await res.json();
        cartId = data.data.id;
        if (cartId) {
            localStorage.setItem('cartId', cartId);
        }
    }
    return cartId!;
}
