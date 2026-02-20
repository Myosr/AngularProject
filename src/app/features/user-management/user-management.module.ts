import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management.component';

@NgModule({
    declarations: [UserManagementComponent],
    imports: [CommonModule, RouterModule.forChild([{ path: '', component: UserManagementComponent }])]
})
export class UserManagementModule { }
