import { Component, OnInit } from '@angular/core';
import { MyOrdersService } from './my-orders.service';
import { AuthService } from '../../core/auth.service';
import { Order } from '../../models/order.model';

@Component({
    selector: 'app-my-orders',
    templateUrl: './my-orders.component.html',
    styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
    orders: Order[] = [];
    loading = true;
    errorMsg = '';
    selectedOrder: Order | null = null;
    showDetail = false;

    // Cancel confirm
    showCancelModal = false;
    cancellingId: number | null = null;
    cancellingRef = '';

    constructor(
        private svc: MyOrdersService,
        private auth: AuthService
    ) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.loading = true;
        const userId = this.auth.getCurrentUser()?.uid ?? 'anonymous';
        this.svc.getByUser(userId).subscribe({
            next: (data) => {
                this.orders = data;
                this.loading = false;
            },
            error: (err) => {
                this.errorMsg = err?.message ?? 'Failed to load orders';
                this.loading = false;
            }
        });
    }

    viewDetail(order: Order): void {
        this.selectedOrder = null;
        this.showDetail = true;
        this.svc.getById(order.orderID!).subscribe({
            next: (full) => { this.selectedOrder = full; },
            error: () => { this.showDetail = false; }
        });
    }

    closeDetail(): void {
        this.showDetail = false;
        this.selectedOrder = null;
    }

    confirmCancel(order: Order): void {
        if (order.status !== 'En attente' && order.status !== 'Pending') return;
        this.cancellingId = order.orderID ?? null;
        this.cancellingRef = `#${order.orderID}`;
        this.showCancelModal = true;
    }

    onCancelConfirmed(): void {
        if (!this.cancellingId) return;
        this.showCancelModal = false;
        this.svc.cancel(this.cancellingId).subscribe({
            next: () => this.loadOrders(),
            error: (err) => { this.errorMsg = err?.message ?? 'Cancel failed'; }
        });
    }

    onCancelCancelled(): void {
        this.showCancelModal = false;
        this.cancellingId = null;
    }

    getStatusClass(status?: string): string {
        if (!status) return 'badge-default';
        const s = status.toLowerCase();
        if (s.includes('complet') || s === 'completed') return 'badge-success';
        if (s.includes('attente') || s === 'pending') return 'badge-warning';
        if (s.includes('cancel')) return 'badge-error';
        return 'badge-default';
    }

    isPending(order: Order): boolean {
        const s = (order.status ?? '').toLowerCase();
        return s.includes('attente') || s === 'pending';
    }
}
