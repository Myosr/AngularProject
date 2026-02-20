import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InvoicesComponent } from './invoices.component';

@NgModule({
    declarations: [InvoicesComponent],
    imports: [CommonModule, RouterModule.forChild([{ path: '', component: InvoicesComponent }])]
})
export class InvoicesModule { }
