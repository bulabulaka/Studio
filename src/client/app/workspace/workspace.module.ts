import {NgModule, ModuleWithProviders} from '@angular/core';
import {WorkspaceComponent} from './workspace.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {TopMenuComponent} from './top-menu/top-menu.component';
import {LeftNavComponent} from './left-nav/left-nav.component';
import {SideMenuComponent} from './left-nav/side-menu/side-menu.component';

const workspaceRoutes: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: WorkspaceComponent,
    children: [
      {path: '', redirectTo: 'permission', pathMatch: 'full'},
      {path: 'permission', loadChildren: '../permission/permission.module#PermissionModule'}
    ]
  }
]);

@NgModule({
  imports: [
    SharedModule,
    workspaceRoutes
  ],
  declarations: [WorkspaceComponent, TopMenuComponent, LeftNavComponent, SideMenuComponent]
})
export class WorkspaceModule {
}
