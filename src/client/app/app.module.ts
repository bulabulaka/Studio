import {BrowserModule} from '@angular/platform-browser';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from './shared/index'
import {AppComponent} from './app.component';
import {CanNotFindPageComponent, NoPermissionComponent} from './error-handle/index';
import {LoginComponent} from './login/login.component';
import {ApiService, AuthGuardService, UserService, NgCookieService, EventBusService, PermissionService} from './shared/index';
import {CookieService} from 'angular2-cookie/services/cookies.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'no_permission',
    component: NoPermissionComponent
  },
  {
    path: 'workspace',
    loadChildren: './workspace/workspace.module#WorkspaceModule',
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    component: CanNotFindPageComponent
  }
], {useHash: true});


@NgModule({
  declarations: [
    AppComponent,
    CanNotFindPageComponent,
    NoPermissionComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    rootRouting
  ],
  providers: [
    ApiService,
    AuthGuardService,
    UserService,
    CookieService,
    NgCookieService,
    EventBusService,
    PermissionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
