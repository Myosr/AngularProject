import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
    @Input() visible = false;
    @Input() title = 'Confirm Action';
    @Input() message = 'Are you sure you want to proceed?';
    @Input() confirmLabel = 'Delete';
    @Input() cancelLabel = 'Cancel';
    @Input() type: 'danger' | 'warning' = 'danger';

    @Output() confirmed = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    onConfirm() { this.confirmed.emit(); }
    onCancel() { this.cancelled.emit(); }
}
