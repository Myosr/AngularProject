import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    /** Emitted when the mobile hamburger is clicked */
    @Output() menuClick = new EventEmitter<void>();

    constructor(public auth: AuthService, private router: Router) { }

    getUserName(): string {
        const user = this.auth.getCurrentUser();
        return user?.displayName || 'Guest';
    }

    getInitial(): string {
        return this.getUserName().charAt(0).toUpperCase();
    }

    logout(): void {
        this.auth.logout().subscribe(() => this.router.navigate(['/login']));
    }
}
