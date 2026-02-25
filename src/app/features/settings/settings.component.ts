import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';

interface SettingsData {
    displayName: string;
    email: string;
    theme: 'light' | 'dark' | 'system';
    notifyOrders: boolean;
    notifyPromotions: boolean;
    notifySystem: boolean;
    language: string;
}

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    settings: SettingsData = {
        displayName: '',
        email: '',
        theme: 'light',
        notifyOrders: true,
        notifyPromotions: true,
        notifySystem: true,
        language: 'en'
    };

    saved = false;
    private storageKey = 'salesdw_settings';

    constructor(private auth: AuthService) { }

    ngOnInit(): void {
        // Load user info
        const raw = localStorage.getItem('salesdw_user');
        if (raw) {
            try {
                const u = JSON.parse(raw);
                this.settings.displayName = u.displayName ?? '';
                this.settings.email = u.email ?? '';
            } catch { }
        }

        // Load saved preferences
        const savedRaw = localStorage.getItem(this.storageKey);
        if (savedRaw) {
            try {
                const s = JSON.parse(savedRaw);
                this.settings.theme = s.theme ?? 'light';
                this.settings.notifyOrders = s.notifyOrders ?? true;
                this.settings.notifyPromotions = s.notifyPromotions ?? true;
                this.settings.notifySystem = s.notifySystem ?? true;
                this.settings.language = s.language ?? 'en';
            } catch { }
        }
    }

    save(): void {
        localStorage.setItem(this.storageKey, JSON.stringify({
            theme: this.settings.theme,
            notifyOrders: this.settings.notifyOrders,
            notifyPromotions: this.settings.notifyPromotions,
            notifySystem: this.settings.notifySystem,
            language: this.settings.language
        }));
        this.saved = true;
        setTimeout(() => this.saved = false, 3000);
    }
}
