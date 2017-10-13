import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Observable, BehaviorSubject, ReplaySubject} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ApiService} from './api.service';
import {NgCookieService} from './cookie.service';
import {ResultValue, UserModel, PermissionGroupModel, RoleModel} from '../../../../shared/index';
import {environment} from '../../../environments/environment';

@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<UserModel>(new UserModel());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private hasAccessTokenSubject = new ReplaySubject<boolean>(1);
  public hasAccessToken = this.hasAccessTokenSubject.asObservable();

  constructor(private apiService: ApiService, private http: Http, private cookieService: NgCookieService) {
  }

  login(username: string, password: string): Observable<{ resultValue: ResultValue<UserModel> }> {
    return this.apiService.post('/login', {username: username, password: password})
      .map(data => {
        if (data.resultValue.RCode === environment.success_code && data.resultValue.Data && data.resultValue.Token) {
          this.currentUserSubject.next(data.resultValue.Data);
        }
        return data;
      })
  }

  getCurrentUserInfo(): Observable<{ resultValue: ResultValue<UserModel> }> {
    return this.apiService.get('/user/get_userinfo')
      .map(data => {
        if (data.resultValue.RCode === environment.success_code && data.resultValue.Data) {
          this.currentUserSubject.next(data.resultValue.Data);
        }
        return data;
      })
  }

  /*get Users*/
  getUsers(page: number, pageSize: number): Observable<{ resultValue: ResultValue<UserModel[]> }> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('page', `${page}`);
    params.set('pageSize', `${pageSize}`);
    return this.apiService.get('/user/get_users', params)
      .map(data => data);
  }

  /*get_user_roles*/
  getUserRoles(userId: number, page: number, pageSize: number): Observable<{ resultValue: ResultValue<RoleModel[]> }> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('userId', `${userId}`);
    params.set('page', `${page}`);
    params.set('pageSize', `${pageSize}`);
    return this.apiService.get('/user/get_user_roles', params)
      .map(data => data);
  }

  /*get_user_donot_have_roles*/
  getUserDonotHaveRoles(userId: number): Observable<{ resultValue: ResultValue<RoleModel[]> }> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('userId', `${userId}`);
    return this.apiService.get('/user/get_user_donot_have_roles', params)
      .map(data => data)
  }

  /*add roles to the user  batch add*/
  addUserRoles(userId: number, roleIdArray: string, roleIdArrayLength: number,
               operatorId: number): Observable<{ resultValue: ResultValue<boolean> }> {
    return this.apiService.post('/user/add_user_roles', {
      roleIdArray: roleIdArray,
      userId: userId,
      roleIdArrayLength: roleIdArrayLength,
      operatorId: operatorId
    }).map(data => data);
  }

  /*get_user_add_or_minus_permission_group*/
  getUserAddOrMinusPermissionGroup(flag: number, userId: number, page: number,
                                   pageSize: number): Observable<{ resultValue: ResultValue<PermissionGroupModel[]> }> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('flag', `${flag}`);
    params.set('userId', `${userId}`);
    params.set('page', `${page}`);
    params.set('pageSize', `${pageSize}`);
    return this.apiService.get('/user/get_user_add_or_minus_permission_group', params)
      .map(data => data);
  }

  /*get_user_have_not_processing_permission_groups*/
  getUserHaveNotProcessingPermissionGroups(userId: number): Observable<{ resultValue: ResultValue<PermissionGroupModel[]> }> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('userId', `${userId}`);
    return this.apiService.get('/user/get_user_have_not_processing_permission_groups', params)
      .map(data => data)
  }

  /*processing_permission_groups*/
  processingPermissionGroups(permissionGroupIdArray: string, userId: number, permissionGroupIdArrayLength: number, operatorId: number,
                             flag: number): Observable<{ resultValue: ResultValue<boolean> }> {
    return this.apiService.post('/user/processing_permission_groups', {
      permissionGroupIdArray: permissionGroupIdArray,
      userId: userId,
      permissionGroupIdArrayLength: permissionGroupIdArrayLength,
      operatorId: operatorId,
      flag: flag
    }).map(data => data);
  }

  getToken() {
    return this.cookieService.getCookie(environment.cookie_key);
  }

  saveToken(token: string) {
    this.cookieService.setCookie(environment.cookie_key, token);
    this.hasAccessTokenSubject.next(true);
  }

  removeToken() {
    this.cookieService.destoryCookie(environment.cookie_key);
    this.hasAccessTokenSubject.next(false);
  }

  checkAccessToken() {
    if (this.getToken()) {
      // check token is vaild
      this.getCurrentUserInfo()
        .subscribe((response) => {
          if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
            this.hasAccessTokenSubject.next(true);
          } else {
            this.hasAccessTokenSubject.next(false);
          }
        });
    } else {
      this.hasAccessTokenSubject.next(false);
    }
  }
}
