import {NgModule, ModuleWithProviders} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {UserComponent} from './user.component';
import {RouterModule} from '@angular/router';
import {UserTableComponent} from './user-table/user-table.component';
import {DialogModule, ButtonModule, PaginatorModule, DataTableModule} from 'primeng/primeng';
import {AuthGuardService} from '../shared/index';

const userRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: UserComponent,
    children: [
      {path: '', redirectTo: 'user_table', pathMatch: 'full'},
      {path: 'user_table', component: UserTableComponent, canActivate: [AuthGuardService]},
    ]
  }
]);

@NgModule({
  imports: [
    SharedModule,
    userRouting,
    DialogModule,
    ButtonModule,
    PaginatorModule,
    DataTableModule
  ],
  declarations: [UserComponent, UserTableComponent]
})
export class UserModule {
}
