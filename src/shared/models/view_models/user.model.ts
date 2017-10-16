import {PermissionModel} from './permission.model';

export class UserModel {
  id: number;
  username: string;
  auditstat: number;
  expiry_date: Date;
  name: string;
  sex?: number;
  email: string;
  tel: string;
  permissionList: PermissionModel[];
}
