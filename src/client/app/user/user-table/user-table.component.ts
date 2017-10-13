import {Component, OnInit} from '@angular/core';
import {flyIn} from '../../shared/index';
import {Router} from '@angular/router';
import {UserService} from '../../shared/index';
import {RoleModel, UserModel, PermissionGroupModel} from '../../../../shared/index';
import {environment} from '../../../environments/environment';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
  animations: [
    flyIn
  ]
})
export class UserTableComponent implements OnInit {
  public showUserRolesDialog = false;
  public showAddUserRolesDialog = false;
  public showPermissionGroupsDialog = false;
  public showAddPermissionGroupsDialog = false;
  public currentUser: UserModel;
  public usersArray: UserModel[] = [];
  public rolesArray: RoleModel[] = []; // 用户已拥有角色组
  public doNotHaveRoleArray: RoleModel[] = []; // 用户未拥有角色组
  public addUserRolesSelectionArray: RoleModel[] = [];
  public permissionGroupsArray: PermissionGroupModel[] = []; // 用户已拥有的权限组
  public doNotHavePermissionGroupsArray: PermissionGroupModel[] = []; // 用户未拥有的权限组
  public addPermissionGroupsSelectionArray: PermissionGroupModel[] = [];
  public userCurrentPage = 1;
  public userRolesCurrentPage = 1;
  public permissionGroupsCurrentPage = 1;
  public roleCurrentPage = 1;
  public rolesTotalCount = 0;
  public usersTotalCount = 0;
  public permissionGroupsTotalCount = 0;
  public itemsPerPage = 10; // 分页大小
  public hasSubmit: boolean;
  public userId: number; // 列表中被选中的用户

  constructor(private router: Router, private userService: UserService) {
    this.hasSubmit = false;
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (response) => {
        this.currentUser = response;
      }
    );
    this.userService.getUsers(this.userCurrentPage, this.itemsPerPage).subscribe(
      (response) => {
        this.usersArray = response.resultValue.Data;
        this.usersTotalCount = response.resultValue.TotalCount;
      }
    );
  }

  // 用户已有角色弹出框
  userRolesDialog(userId: number) {
    this.userId = userId;
    this.userRolesCurrentPage = 1;
    this.userService.getUserRoles(this.userId, 1, this.itemsPerPage)
      .subscribe((response) => {
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
          this.rolesArray = response.resultValue.Data;
          this.rolesTotalCount = response.resultValue.TotalCount;
          this.showUserRolesDialog = true;
        }
      });
  }

  // 用户未拥有角色弹出框
  userDonotHaveRolesDialog(userId: number) {
    this.userId = userId;
    this.addUserRolesSelectionArray = [];
    this.userService.getUserDonotHaveRoles(this.userId)
      .subscribe((response) => {
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
          this.doNotHaveRoleArray = response.resultValue.Data;
          this.showAddUserRolesDialog = true;
        }
      })
  }

  // 给用户批量添加角色
  addUserRolesSubmit(userId: number) {
    this.hasSubmit = true;
    let roleIdArray = '';
    _(this.addUserRolesSelectionArray).forEach((n) => {
      roleIdArray += n.id + ',';
    });
    this.userService.addUserRoles(userId, roleIdArray, this.addUserRolesSelectionArray.length, this.currentUser.id)
      .subscribe((response) => {
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data === true) {

        }
        this.showAddUserRolesDialog = false;
        this.hasSubmit = false;
      });
  }

  // 用户所拥有的角色组分页
  userRolesPaginate(event) {
    if (event && event.page >= 0) {
      this.userService.getUserRoles(this.userId, event.page + 1, this.itemsPerPage)
        .subscribe((response) => {
          if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
            this.rolesArray = response.resultValue.Data;
            this.rolesTotalCount = response.resultValue.TotalCount;
            this.userRolesCurrentPage = event.page + 1;
          }
        });
    }
  }

  // 用户分页
  usersPaginate(event) {
    if (event && event.page >= 0) {
      this.userService.getUsers((event.page + 1), this.itemsPerPage).subscribe(
        (response) => {
          if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
            this.usersArray = response.resultValue.Data;
            this.usersTotalCount = response.resultValue.TotalCount;
            this.userCurrentPage = event.page + 1;
          }
        }
      )
    }
  }
}
