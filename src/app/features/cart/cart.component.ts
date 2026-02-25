import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { AuthService } from '../../core/auth.service';
import { Cart, CartItem } from '../../models/cart.model';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
    cart: Cart = { userId: '', items: [], subTotal: 0, itemCount: 0 };
    products: Product[] = [];
    loading = true;
    productsLoading = true;
    errorMsg = '';
    successMsg = '';
    checkingOut = false;

    // product catalog panel
    showCatalog = false;
    catalogSearch = '';

    // confirm clear
    showClearModal = false;

    private userId = '';

    constructor(
        private svc: CartService,
        private auth: AuthService
    ) { }

    ngOnInit(): void {
        this.userId = this.auth.getCurrentUser()?.uid ?? 'anonymous';
        this.loadCart();
        this.loadProducts();
    }

    loadCart(): void {
        this.loading = true;
        this.svc.getCart(this.userId).subscribe({
            next: (data) => { this.cart = data; this.loading = false; },
            error: (err) => { this.errorMsg = err?.message; this.loading = false; }
        });
    }

    loadProducts(): void {
        this.productsLoading = true;
        this.svc.getProducts().subscribe({
            next: (data) => { this.products = data; this.productsLoading = false; },
            error: () => { this.productsLoading = false; }
        });
    }

    get filteredProducts(): Product[] {
        if (!this.catalogSearch.trim()) return this.products;
        const q = this.catalogSearch.toLowerCase();
        return this.products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            (p.category ?? '').toLowerCase().includes(q) ||
            (p.sku ?? '').toLowerCase().includes(q)
        );
    }

    addToCart(product: Product): void {
        this.clearMessages();
        this.svc.addItem({ userId: this.userId, productId: Number(product.id), quantity: 1 }).subscribe({
            next: (data) => {
                this.cart = data;
                this.successMsg = `Added "${product.name}" to cart`;
                this.autoHideSuccess();
            },
            error: (err) => { this.errorMsg = err?.message; }
        });
    }

    updateQty(item: CartItem, delta: number): void {
        const newQty = item.quantity + delta;
        if (newQty < 1) return;
        this.clearMessages();
        this.svc.updateItem({ userId: this.userId, productId: item.productId, quantity: newQty }).subscribe({
            next: (data) => { this.cart = data; },
            error: (err) => { this.errorMsg = err?.message; }
        });
    }

    removeItem(item: CartItem): void {
        this.clearMessages();
        this.svc.removeItem(this.userId, item.productId).subscribe({
            next: (data) => { this.cart = data; this.successMsg = 'Item removed'; this.autoHideSuccess(); },
            error: (err) => { this.errorMsg = err?.message; }
        });
    }

    confirmClear(): void {
        this.showClearModal = true;
    }

    onClearConfirmed(): void {
        this.showClearModal = false;
        this.svc.clearCart(this.userId).subscribe({
            next: (data) => { this.cart = data; this.successMsg = 'Cart cleared'; this.autoHideSuccess(); },
            error: (err) => { this.errorMsg = err?.message; }
        });
    }

    onClearCancelled(): void {
        this.showClearModal = false;
    }

    checkout(): void {
        this.clearMessages();
        this.checkingOut = true;
        this.svc.checkout(this.userId).subscribe({
            next: (res) => {
                this.checkingOut = false;
                this.cart = { userId: this.userId, items: [], subTotal: 0, itemCount: 0 };
                this.successMsg = `${res.message} — Order #${res.orderId}`;
            },
            error: (err) => {
                this.checkingOut = false;
                this.errorMsg = err?.message ?? 'Checkout failed';
            }
        });
    }

    openCatalog(): void { this.showCatalog = true; this.catalogSearch = ''; }
    closeCatalog(): void { this.showCatalog = false; }

    private clearMessages(): void { this.errorMsg = ''; this.successMsg = ''; }
    private autoHideSuccess(): void { setTimeout(() => { this.successMsg = ''; }, 3000); }
}
