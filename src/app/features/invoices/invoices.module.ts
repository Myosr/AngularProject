import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { InvoicesComponent } from './invoices.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [InvoicesComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: InvoicesComponent }])
    ]
})
export class InvoicesModule { }
