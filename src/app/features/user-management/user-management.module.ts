import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { UserManagementComponent } from './user-management.component';
import { UserManagementService } from './user-management.service';

@NgModule({
    declarations: [UserManagementComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: UserManagementComponent }])
    ],
    providers: [UserManagementService]
})
export class UserManagementModule { }

