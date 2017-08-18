import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ApiService} from './api.service';
import {URLSearchParams} from '@angular/http';
import {permission, ResultValue, m_permission_group} from '../../../../shared/index';
import {m_permission} from '../../../../shared/models/entity.model';

@Injectable()
export class PermissionService {

  constructor(private apiService: ApiService) {
  }

  addPermission(permission: permission): Observable<{ resultValue: ResultValue<boolean> }> {
    return this.apiService.post('/permission/add_permission', {permission: permission})
      .map(data => data);
  }

  getPermission(page: number, pageSize: number): Observable<{ resultValue: ResultValue<permission[]> }> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('page', `${page}`);
    params.set('pageSize', `${pageSize}`);
    return this.apiService.get('/permission/get_permissions', params)
      .map(data => data);
  }

  addPermissionGroup(permissionGroup: m_permission_group): Observable<{ resultValue: ResultValue<boolean> }> {
    return this.apiService.post('/permission/add_permission_group', {permission_group: permissionGroup})
      .map(data => data);
  }

  getPermissionGroups(page: number, pageSize: number): Observable<{ resultValue: ResultValue<m_permission_group[]> }> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('page', `${page}`);
    params.set('pageSize', `${pageSize}`);
    return this.apiService.get('/permission/get_permission_groups', params)
      .map(data => data);
  }

  getPermissionGroupPermissions(permissionGroupId: number, page: number, pageSize: number): Observable<{ resultValue: ResultValue<permission[]> }> {
    let params: URLSearchParams = new URLSearchParams();
    params.set(`permissionGroupId`, `${permissionGroupId}`);
    params.set(`page`, `${page}`);
    params.set(`pageSize`, `${pageSize}`);
    return this.apiService.get('/permission/get_permission_group_permissions', params)
      .map(data => data);
  }
}
