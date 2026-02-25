export interface CartItem {
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    total: number;
}

export interface Cart {
    userId: string;
    items: CartItem[];
    subTotal: number;
    itemCount: number;
}

export interface AddToCartPayload {
    userId: string;
    productId: number;
    quantity: number;
}

export interface UpdateCartPayload {
    userId: string;
    productId: number;
    quantity: number;
}
