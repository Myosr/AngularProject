import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [ReportsComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: ReportsComponent }])
    ]
})
export class ReportsModule { }
