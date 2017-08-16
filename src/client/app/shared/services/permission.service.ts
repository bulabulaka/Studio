import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ApiService} from './api.service';
import {URLSearchParams} from '@angular/http';
import {permission, ResultValue} from '../../../../shared/index';

@Injectable()
export class PermissionService {

  constructor(private apiService: ApiService) {
  }

  addPermission(permission: permission): Observable<{ resultValue: ResultValue<number> }> {
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
}
