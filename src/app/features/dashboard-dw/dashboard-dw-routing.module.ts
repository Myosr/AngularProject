import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardDwComponent } from './dashboard-dw.component';

const routes: Routes = [{ path: '', component: DashboardDwComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardDwRoutingModule { }
