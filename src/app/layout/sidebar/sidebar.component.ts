import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

export interface MenuItem {
    label: string;
    icon: string;   // Material Icons Rounded name
    route: string;
    roles?: Array<'Admin' | 'User'>;
}

/** All menu items — role filter applied at build time */
const ALL_MENU: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Customers', icon: 'people', route: '/customers', roles: ['Admin'] },
    { label: 'Products', icon: 'inventory_2', route: '/products', roles: ['Admin'] },
    { label: 'Invoices', icon: 'receipt_long', route: '/invoices', roles: ['Admin'] },
    { label: 'Reports', icon: 'bar_chart', route: '/reports' },
    { label: 'User Management', icon: 'manage_accounts', route: '/user-management', roles: ['Admin'] },
    { label: 'Profile', icon: 'person', route: '/profile' },
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    /** Controlled by LayoutComponent */
    @Input() collapsed = false;
    /** Mobile drawer open state — controlled by LayoutComponent */
    @Input() mobileOpen = false;

    @Output() toggled = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    menu: MenuItem[] = [];

    constructor(public auth: AuthService, public router: Router) { }

    ngOnInit(): void {
        this.buildMenu();
    }

    buildMenu(): void {
        const role = this.auth.getRole();
        this.menu = ALL_MENU.filter(item =>
            !item.roles || (role != null && item.roles.includes(role))
        );
    }

    isActive(route: string): boolean {
        return this.router.isActive(route, { paths: 'subset', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' });
    }

    onToggle(): void {
        this.toggled.emit();
    }

    onBackdropClick(): void {
        this.closed.emit();
    }
}

