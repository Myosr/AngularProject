import { Component, HostListener, OnInit } from '@angular/core';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    isCollapsed = false;
    isMobileOpen = false;

    private readonly MOBILE_BP = 768;

    ngOnInit(): void {
        this.checkViewport();
    }

    @HostListener('window:resize')
    onResize(): void {
        this.checkViewport();
        if (window.innerWidth >= this.MOBILE_BP) {
            this.isMobileOpen = false;
        }
    }

    checkViewport(): void {
        // On mobile, desktop-collapse state doesn't apply
        if (window.innerWidth < this.MOBILE_BP) {
            this.isCollapsed = false;
        }
    }

    /** Called by sidebar toggle button (desktop) */
    onSidebarToggled(): void {
        if (window.innerWidth >= this.MOBILE_BP) {
            this.isCollapsed = !this.isCollapsed;
        } else {
            this.isMobileOpen = !this.isMobileOpen;
        }
    }

    /** Called by sidebar backdrop click (mobile) */
    onSidebarClosed(): void {
        this.isMobileOpen = false;
    }

    /** Hamburger in navbar triggers mobile open */
    openMobileSidebar(): void {
        this.isMobileOpen = true;
    }
}

