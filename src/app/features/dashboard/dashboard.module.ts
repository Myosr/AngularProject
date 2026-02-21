import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, DashboardRoutingModule],
    providers: [DashboardService]
})
export class DashboardModule { }
