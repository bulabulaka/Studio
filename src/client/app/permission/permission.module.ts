import {NgModule, ModuleWithProviders} from '@angular/core';
import {PermissionComponent} from './permission.component';
import {PermissionTableComponent} from './permission-table/permission-table.component';
import {SharedModule} from '../shared/shared.module';
import {Data, RouterModule} from '@angular/router';
import {DialogModule, ButtonModule, PaginatorModule, DataTableModule} from 'primeng/primeng';
import {PermissionGroupComponent} from './permission-group/permission-group.component';

const permissionRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: PermissionComponent,
    children: [
      {path: '', redirectTo: 'permission_table', pathMatch: 'full'},
      {path: 'permission_table', component: PermissionTableComponent},
      {path: 'permission_group', component: PermissionGroupComponent}
    ]
  }
]);

@NgModule({
  imports: [
    SharedModule,
    permissionRouting,
    DialogModule,
    ButtonModule,
    PaginatorModule,
    DataTableModule
  ],
  declarations: [PermissionComponent, PermissionTableComponent, PermissionGroupComponent]
})
export class PermissionModule {
}
