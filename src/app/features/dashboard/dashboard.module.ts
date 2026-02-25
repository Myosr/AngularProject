import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, DashboardRoutingModule, SharedModule, BaseChartDirective],
    providers: [DashboardService, provideCharts(withDefaultRegisterables())]
})
export class DashboardModule { }

