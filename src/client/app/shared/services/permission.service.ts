import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ApiService} from './api.service';
import {URLSearchParams} from '@angular/http';
import {PermissionModel, ResultValue, PermissionGroupModel} from '../../../../shared/index';

@Injectable()
export class PermissionService {

  constructor(private apiService: ApiService) {
  }

  addPermission(permission: PermissionModel): Observable<{ resultValue: ResultValue<boolean> }> {
    return this.apiService.post('/permission/add_permission', {permission: permission})
      .map(data => data);
  }

  getPermission(page: number, pageSize: number): Observable<{ resultValue: ResultValue<PermissionModel[]> }> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('page', `${page}`);
    params.set('pageSize', `${pageSize}`);
    return this.apiService.get('/permission/get_permissions', params)
      .map(data => data);
  }

  addPermissionGroup(permissionGroup: PermissionGroupModel): Observable<{ resultValue: ResultValue<boolean> }> {
    return this.apiService.post('/permission/add_permission_group', {permission_group: permissionGroup})
      .map(data => data);
  }

  /*flag: 0:获取所有的包括禁用的 1:获取有效的*/
  getPermissionGroups(flag: number, page: number, pageSize: number): Observable<{ resultValue: ResultValue<PermissionGroupModel[]> }> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('page', `${page}`);
    params.set('pageSize', `${pageSize}`);
    params.set('flag', `${flag}`);
    return this.apiService.get('/permission/get_permission_groups', params)
      .map(data => data);
  }

  getPermissionGroupPermissions(permissionGroupId: number, page: number, pageSize: number): Observable<{ resultValue: ResultValue<PermissionModel[]> }> {
    let params: URLSearchParams = new URLSearchParams();
    params.set(`permissionGroupId`, `${permissionGroupId}`);
    params.set(`page`, `${page}`);
    params.set(`pageSize`, `${pageSize}`);
    return this.apiService.get('/permission/get_permission_group_permissions', params)
      .map(data => data);
  }

  // 获取权限组为拥有的所有权限 前端分页
  getPermissionGroupDoNotHavePermissions(permissionGroupId: number): Observable<{ resultValue: ResultValue<PermissionModel[]> }> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('permissionGroupId', `${permissionGroupId}`);
    return this.apiService.get('/permission/get_permission_group_donot_have_permissions', params)
      .map(data => data);
  }

  // 给权限组添加权限
  addPermissionGroupPermissions(permissionGroupId: number, permissionIdArray: string, permissionIdArrayLength: number, operatorId: number): Observable<{ resultValue: ResultValue<boolean> }> {
    return this.apiService.post('/permission/add_permission_group_permissions', {
      permissionIdArray: permissionIdArray,
      permissionGroupId: permissionGroupId,
      permissionIdArrayLength: permissionIdArrayLength,
      operatorId: operatorId
    }).map(data => data);
  }
}
