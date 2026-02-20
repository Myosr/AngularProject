import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

interface MenuItem { label: string; icon?: string; route?: string; roles?: string[] }

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    collapsed = false;
    menu: MenuItem[] = [];

    constructor(public auth: AuthService, public router: Router) {
        this.buildMenu();
    }

    buildMenu() {
        const role = this.auth.getRole();
        const adminMenu: MenuItem[] = [
            { label: 'Dashboard', route: '/dashboard' },
            { label: 'Customers', route: '/customers' },
            { label: 'Products', route: '/products' },
            { label: 'Invoices', route: '/invoices' },
            { label: 'Reports', route: '/reports' },
            { label: 'User Management', route: '/user-management' },
            { label: 'Settings', route: '/profile' }
        ];
        const userMenu: MenuItem[] = [
            { label: 'Dashboard', route: '/dashboard' },
            { label: 'Reports', route: '/reports' },
            { label: 'Profile', route: '/profile' }
        ];
        this.menu = role === 'Admin' ? adminMenu : userMenu;
    }

    toggle() {
        this.collapsed = !this.collapsed;
    }

    navigate(route: string | undefined) {
        if (!route) return;
        this.router.navigate([route]);
    }

    @HostListener('window:resize') onResize() {
        if (window.innerWidth < 768) this.collapsed = true;
    }
}
