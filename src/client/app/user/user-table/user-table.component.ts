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
  public showAdditionalPermissionGroupsDialog = false;
  public showReducedPermissionGroupDialog = false;
  public showProcessingPermissionGroupsDialog = false;
  public currentUser: UserModel;
  public usersArray: UserModel[] = [];
  public rolesArray: RoleModel[] = []; // 用户已拥有角色组
  public doNotHaveRoleArray: RoleModel[] = []; // 用户未拥有角色组
  public addUserRolesSelectionArray: RoleModel[] = [];
  public userAdditionalPermissionGroupsArray: PermissionGroupModel[] = []; // 用户已拥有的权限组
  public userReducedPermissionGroupsArray: PermissionGroupModel[] = []; // 用户减少的权限组
  public processingPermissionGroupArray: PermissionGroupModel[] = []; // 未处理的权限组
  public processingPermissionGroupsSelectionArray: PermissionGroupModel[] = [];
  public userCurrentPage = 1;
  public userRolesCurrentPage = 1;
  public userAdditionalPermissionGroupsCurrentPage = 1;
  public userReducedPermissionGroupsCurrentPage = 1;
  public processingPermissionGroupsCurrentPage = 1;
  public rolesTotalCount = 0;
  public usersTotalCount = 0;
  public userAdditionalPermissionGroupsTotalCount = 0;
  public userReducedPermissionGroupsTotalCount = 0;
  public processingPermissionGroupsTotalCount = 0;
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
        if (response.resultValue.RCode === environment.success_code) {
          this.usersArray = response.resultValue.Data;
          this.usersTotalCount = response.resultValue.TotalCount;
        }
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

  // 用户附加权限组弹出框
  userAdditionalPermissionGroupsDialog(userId: number) {
    this.userId = userId;
    this.userAdditionalPermissionGroupsCurrentPage = 1;
    this.userService.getUserAddOrMinusPermissionGroup(1, this.userId, 1, this.itemsPerPage)
      .subscribe((response) => {
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
          this.userAdditionalPermissionGroupsArray = response.resultValue.Data;
          this.userAdditionalPermissionGroupsTotalCount = response.resultValue.TotalCount;
          this.showAdditionalPermissionGroupsDialog = true;
        }
      });
  }

  // 用户减少的权限组弹出框
  userReducedPermissionGroupsDialog(userId: number) {
    this.userId = userId;
    this.userAdditionalPermissionGroupsCurrentPage = 1;
    this.userService.getUserAddOrMinusPermissionGroup(2, this.userId, 1, this.itemsPerPage)
      .subscribe((response) => {
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
          this.userReducedPermissionGroupsArray = response.resultValue.Data;
          this.userReducedPermissionGroupsTotalCount = response.resultValue.TotalCount;
          this.showReducedPermissionGroupDialog = true;
        }
      });
  }

  // 用户未处理的权限组弹出框
  processingPermissionGroupsDialog(userId: number) {
    this.userId = userId;
    this.processingPermissionGroupsSelectionArray = [];
    this.userService.getUserHaveNotProcessingPermissionGroups(this.userId)
      .subscribe((response) => {
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
          this.processingPermissionGroupArray = response.resultValue.Data;
          this.showProcessingPermissionGroupsDialog = true;
        }
      })
  }

  // 用户减少的权限组分页
  userReducedPermissionGroupsPaginate(event) {
    if (event && event.page >= 0) {
      this.userService.getUserAddOrMinusPermissionGroup(2, this.userId, event.page + 1, this.itemsPerPage)
        .subscribe((response) => {
          if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
            this.userReducedPermissionGroupsArray = response.resultValue.Data;
            this.userReducedPermissionGroupsTotalCount = response.resultValue.TotalCount;
            this.userReducedPermissionGroupsCurrentPage = event.page + 1;
          }
        });
    }
  }


  // 用户附加权限组分页
  userAdditionalPermissionGroupsPaginate(event) {
    if (event && event.page >= 0) {
      this.userService.getUserAddOrMinusPermissionGroup(1, this.userId, event.page + 1, this.itemsPerPage)
        .subscribe((response) => {
          if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
            this.userAdditionalPermissionGroupsArray = response.resultValue.Data;
            this.userAdditionalPermissionGroupsTotalCount = response.resultValue.TotalCount;
            this.userAdditionalPermissionGroupsCurrentPage = event.page + 1;
          }
        });
    }
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

  // 给用户批量处理权限组（添加或减少）
  processingPermissionGroupsSubmit(userId: number, flag: number) {
    this.hasSubmit = true;
    let permissionGroupIdArray = '';
    _(this.processingPermissionGroupsSelectionArray).forEach((n) => {
      permissionGroupIdArray += n.id + ',';
    });
    this.userService.processingPermissionGroups(permissionGroupIdArray, userId, this.processingPermissionGroupsSelectionArray.length,
      this.currentUser.id, flag)
      .subscribe((response) => {
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data === true) {

        }
        this.showProcessingPermissionGroupsDialog = false;
        this.hasSubmit = false;
      });
  }
}
