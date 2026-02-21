import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    constructor(public auth: AuthService, private router: Router) { }

    getUserName(): string {
        const user = this.auth.getCurrentUser();
        return user?.displayName || 'Guest';
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}
