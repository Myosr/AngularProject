import { Component, OnInit } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { AppNotification } from '../../models/notification.model';
import { AuthService } from '../../core/auth.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
    notifications: AppNotification[] = [];
    loading = true;
    errorMsg = '';
    unreadCount = 0;

    constructor(
        private notifSvc: NotificationsService,
        private auth: AuthService
    ) { }

    ngOnInit(): void {
        this.load();
    }

    private getUserId(): string {
        const raw = localStorage.getItem('salesdw_user');
        if (raw) {
            try { return JSON.parse(raw).uid ?? 'anonymous'; } catch { return 'anonymous'; }
        }
        return 'anonymous';
    }

    load(): void {
        this.loading = true;
        this.errorMsg = '';
        const uid = this.getUserId();

        this.notifSvc.getAll(uid).subscribe({
            next: data => {
                this.notifications = data;
                this.unreadCount = data.filter(n => !n.isRead).length;
                this.loading = false;
            },
            error: err => {
                this.errorMsg = err;
                this.loading = false;
            }
        });
    }

    markAsRead(notif: AppNotification): void {
        if (notif.isRead) return;
        const uid = this.getUserId();
        this.notifSvc.markRead(notif.id, uid).subscribe({
            next: () => {
                notif.isRead = true;
                this.unreadCount = this.notifications.filter(n => !n.isRead).length;
            },
            error: err => this.errorMsg = err
        });
    }

    markAllRead(): void {
        const uid = this.getUserId();
        this.notifSvc.markAllRead(uid).subscribe({
            next: () => {
                this.notifications.forEach(n => n.isRead = true);
                this.unreadCount = 0;
            },
            error: err => this.errorMsg = err
        });
    }

    getIcon(type: string): string {
        switch (type) {
            case 'success': return 'check_circle';
            case 'warning': return 'warning';
            case 'error': return 'error';
            default: return 'info';
        }
    }

    getTimeAgo(dateStr: string): string {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return date.toLocaleDateString();
    }
}
