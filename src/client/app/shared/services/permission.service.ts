import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ApiService} from './api.service';
import {m_permission, ResultValue} from '../../../../shared/index';

@Injectable()
export class PermissionService {

  constructor(private apiService: ApiService) {
  }

  addPermission(permission: m_permission): Observable<{ resultValue: ResultValue<number> }> {
    return this.apiService.post('/api/permission/add_permission', {permission: permission})
      .map(data => data)
  }
}
