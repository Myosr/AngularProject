import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const roles = route.data['roles'] as Array<string> | undefined;
        const userRole = this.auth.getRole();
        if (!roles || roles.length === 0) {
            return true;
        }
        if (userRole && roles.includes(userRole)) {
            return true;
        }
        return this.router.createUrlTree(['/dashboard']);
    }
}
