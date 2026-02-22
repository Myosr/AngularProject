import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProductsComponent } from './products.component';
import { ProductService } from './product.service';

@NgModule({
    declarations: [ProductsComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: ProductsComponent }])
    ],
    providers: [ProductService]
})
export class ProductsModule { }

