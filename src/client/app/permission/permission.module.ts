import {NgModule, ModuleWithProviders} from '@angular/core';
import {PermissionComponent} from './permission.component';
import {PermissionTableComponent} from './permission-table/permission-table.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {DialogModule, ButtonModule, Button} from 'primeng/primeng';

const permissionRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: PermissionComponent,
    children: [
      {path: '', redirectTo: 'permissiontable', pathMatch: 'full'},
      {path: 'permissiontable', component: PermissionTableComponent}
    ]
  }
]);

@NgModule({
  imports: [
    SharedModule,
    permissionRouting,
    DialogModule,
    ButtonModule
  ],
  declarations: [PermissionComponent, PermissionTableComponent]
})
export class PermissionModule {
}
