import {NgModule, ModuleWithProviders} from '@angular/core';
import {WorkspaceComponent} from './workspace.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';

const workspaceRoutes: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: WorkspaceComponent
  }
]);

@NgModule({
  imports: [
    SharedModule,
    workspaceRoutes
  ],
  declarations: [WorkspaceComponent]
})
export class WorkspaceModule {
}
