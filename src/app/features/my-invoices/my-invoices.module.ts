import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyInvoicesRoutingModule } from './my-invoices-routing.module';
import { MyInvoicesComponent } from './my-invoices.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [MyInvoicesComponent],
    imports: [CommonModule, MyInvoicesRoutingModule, SharedModule]
})
export class MyInvoicesModule { }
