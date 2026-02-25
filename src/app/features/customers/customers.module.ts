import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CustomersComponent } from './customers.component';

@NgModule({
    declarations: [CustomersComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: CustomersComponent }])
    ],
    // CustomerService is providedIn:'root' in the service
})
export class CustomersModule { }

