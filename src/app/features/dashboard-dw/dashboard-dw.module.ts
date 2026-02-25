import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { DashboardDwRoutingModule } from './dashboard-dw-routing.module';
import { DashboardDwComponent } from './dashboard-dw.component';
import { DashboardDwService } from './dashboard-dw.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [DashboardDwComponent],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        DashboardDwRoutingModule,
        BaseChartDirective
    ],
    providers: [
        DashboardDwService,
        provideCharts(withDefaultRegisterables())
    ]
})
export class DashboardDwModule { }
