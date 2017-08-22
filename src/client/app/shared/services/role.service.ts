import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ApiService} from './api.service';
import {URLSearchParams} from '@angular/http';
import {ResultValue, m_role} from '../../../../shared/index';
import {m_permission_group} from '../../../../shared/models/entity.model';

@Injectable()
export class RoleService {

  constructor(private apiService: ApiService) {
  }

  //获取所有角色
  getRoles(page: number, pageSize: number): Observable<{ resultValue: ResultValue<m_role[]> }> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('page', `${page}`);
    params.set('pageSize', `${pageSize}`);
    return this.apiService.get('/role/get_roles', params)
      .map(data => data);
  }

  //创建角色
  addRole(role: m_role): Observable<{ resultValue: ResultValue<boolean> }> {
    return this.apiService.post('/role/add_role', {role: role})
      .map(data => data);
  }

  //删除角色

  //角色已有的权限组
  getRolePermissionGroups(roleId: number, page: number, pageSize: number): Observable<{ resultValue: ResultValue<m_permission_group[]> }> {
    let params: URLSearchParams = new URLSearchParams();
    params.set(`roleId`, `${roleId}`);
    params.set(`page`, `${page}`);
    params.set(`pageSize`, `${pageSize}`);
    return this.apiService.get('/role/get_role_permission_groups', params)
      .map(data => data);
  }

  //角色未拥有的权限组
  getRoleDoNotHavePermissionGroups(roleId: number): Observable<{ resultValue: ResultValue<m_permission_group[]> }> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('roleId', `${roleId}`);
    return this.apiService.get('/role/get_role_donot_have_permission_groups', params)
      .map(data => data);
  }

  //给角色添加权限组
  //给权限组添加权限
  addRolePermissionGroups(roleId: number, permissionGroupIdArray: string, permissionGroupIdArrayLength: number, operatorId: number): Observable<{ resultValue: ResultValue<boolean> }> {
    return this.apiService.post('/role/add_role_permission_groups', {
      permissionGroupIdArray: permissionGroupIdArray,
      roleId: roleId,
      permissionGroupIdArrayLength: permissionGroupIdArrayLength,
      operatorId: operatorId
    }).map(data => data);
  }
}
