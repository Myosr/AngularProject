import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StatCardComponent } from './components/stat-card/stat-card.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';

const COMPONENTS = [
    StatCardComponent,
    DataTableComponent,
    ConfirmModalComponent
];

@NgModule({
    declarations: COMPONENTS,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [...COMPONENTS, CommonModule, FormsModule, ReactiveFormsModule]
})
export class SharedModule { }
