export interface Product {
    id?: string;
    name: string;
    sku?: string;
    category?: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive';
    createdAt?: string | Date;
}
