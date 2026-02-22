import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stat-card',
    templateUrl: './stat-card.component.html',
    styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
    @Input() title = '';
    @Input() value: string | number = 0;
    @Input() icon = 'bar_chart';
    @Input() color = '#10b981';
    /** 'up' | 'down' | null — shows trend arrow */
    @Input() trend: 'up' | 'down' | null = null;
    @Input() trendValue = '';
    @Input() loading = false;
}
