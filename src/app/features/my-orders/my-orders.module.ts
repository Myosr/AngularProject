import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyOrdersComponent } from './my-orders.component';
import { MyOrdersRoutingModule } from './my-orders-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [MyOrdersComponent],
    imports: [CommonModule, MyOrdersRoutingModule, SharedModule]
})
export class MyOrdersModule { }
