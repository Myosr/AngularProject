import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    summary: any = {};
    salesByMonth: any[] = [];
    salesByProduct: any[] = [];
    salesByCustomer: any[] = [];

    constructor(private svc: DashboardService) { }

    ngOnInit(): void {
        this.loadSummary();
        this.loadCharts();
    }

    loadSummary() {
        this.svc.getSummary().subscribe(r => this.summary = r);
    }

    loadCharts() {
        this.svc.getSalesByMonth().subscribe(r => this.salesByMonth = r);
        this.svc.getSalesByProduct().subscribe(r => this.salesByProduct = r);
        this.svc.getSalesByCustomer().subscribe(r => this.salesByCustomer = r);
    }
}
