import {BrowserModule} from '@angular/platform-browser';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AppComponent} from "./app.component";
import {CanNotFindPageComponent, NoPermissionComponent} from "./error-handle/index";
import {LoginComponent} from "./login/login.component"

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
    rootRouting,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
