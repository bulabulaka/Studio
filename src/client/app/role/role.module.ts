import {NgModule, ModuleWithProviders} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {RoleComponent} from './role.component';
import {RoleTableComponent} from './role-table/role-table.component';
import {DialogModule, ButtonModule, PaginatorModule, DataTableModule} from 'primeng/primeng';
import {AuthGuardService} from '../shared/index';

const roleRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: RoleComponent,
    children: [
      {path: '', redirectTo: 'role_table', pathMatch: 'full'},
      {path: 'role_table', component: RoleTableComponent, canActivate: [AuthGuardService]},
    ]
  }
]);

@NgModule({
  imports: [
    SharedModule,
    roleRouting,
    DialogModule,
    ButtonModule,
    PaginatorModule,
    DataTableModule
  ],
  declarations: [RoleComponent, RoleTableComponent]
})
export class RoleModule {
}
