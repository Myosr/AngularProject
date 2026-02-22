import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CustomersComponent } from './customers.component';
import { CustomerService } from './customer.service';

@NgModule({
    declarations: [CustomersComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: CustomersComponent }])
    ],
    providers: [CustomerService]
})
export class CustomersModule { }

