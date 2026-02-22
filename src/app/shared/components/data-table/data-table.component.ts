import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface TableColumn {
    key: string;
    label: string;
    type?: 'text' | 'badge' | 'date' | 'currency' | 'actions';
    badgeMap?: Record<string, string>; // value -> badge class suffix
}

@Component({
    selector: 'app-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
    @Input() columns: TableColumn[] = [];
    @Input() data: any[] = [];
    @Input() loading = false;
    @Input() canEdit = false;
    @Input() canDelete = false;
    @Input() emptyMessage = 'No records found.';

    @Output() editRow = new EventEmitter<any>();
    @Output() deleteRow = new EventEmitter<any>();

    skeletonRows = Array(5);

    getCellValue(row: any, col: TableColumn): any {
        return row[col.key];
    }

    getBadgeClass(col: TableColumn, value: any): string {
        if (!col.badgeMap) return 'badge-neutral';
        return col.badgeMap[value] ?? 'badge-neutral';
    }

    formatCurrency(value: any): string {
        if (value == null) return '$0.00';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }

    formatDate(value: any): string {
        if (!value) return '—';
        return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
}
