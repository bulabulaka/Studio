import {Component, OnInit} from '@angular/core';
import {flyIn} from '../../shared/index';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {RoleService, UserService} from '../../shared/index';
import {m_role, m_user, m_permission_group} from '../../../../shared/index';
import {environment} from '../../../environments/environment';
import * as _ from 'lodash';

@Component({
  selector: 'app-role-table',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.scss'],
  animations: [
    flyIn
  ]
})
export class RoleTableComponent implements OnInit {

  public showAddRoleDialog: boolean = false;
  public showPermissionGroupsDialog: boolean = false;
  public showAddPermissionGroupsDialog: boolean = false;
  public currentUser: m_user;
  public roleArray: m_role[] = [];
  public permissionGroupsArray: m_permission_group[] = [];//角色已拥有的权限组
  public doNotHavePermissionGroupsArray: m_permission_group[] = []; //角色未拥有的权限组
  public addPermissionGroupsSelectionArray: m_permission_group[] = [];
  public permissionGroupsCurrentPage = 1;
  public roleCurrentPage = 1;
  public itemsPerPage = 10;//分页大小
  public rolesTotalCount = 0;
  public permissionGroupsTotalCount = 0;
  private role_id: number;//current role id;
  public roleForm: FormGroup;
  public hasSubmit: boolean;

  public formErrors = {
    'name': '',
    'description': ''
  };

  //Error info
  validationMessages = {
    'name': {
      'required': '角色名不能为空'
    },
    'description': {}
  };

  constructor(private router: Router, private formBuilder: FormBuilder, private roleSerivce: RoleService, private userService: UserService) {
    this.roleForm = this.formBuilder.group({
      'name': ['',
        [Validators.required]
      ],
      'description': ['']
    });
    this.roleForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.hasSubmit = false;
  }

  onValueChanged(data?: any) {
    if (!this.roleForm) {
      return;
    }
    const form = this.roleForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          if (!this.formErrors[field]) {
            this.formErrors[field] += messages[key] + ' ';
          } else {
            break;
          }
        }
      }
    }
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (response) => {
        this.currentUser = response;
      }
    );
    this.roleSerivce.getRoles(this.roleCurrentPage, this.itemsPerPage).subscribe(
      (response) => {
        this.roleArray = response.resultValue.Data;
        this.rolesTotalCount = response.resultValue.TotalCount;
      }
    );
  }

  //添加角色弹出框
  addRoleDialog() {
    this.showAddRoleDialog = true;
  }

  //角色分页
  rolesPaginate(event) {
    if (event && event.page >= 0) {
      this.roleSerivce.getRoles((event.page + 1), this.itemsPerPage).subscribe(
        (response) => {
          if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
            this.roleArray = response.resultValue.Data;
            this.rolesTotalCount = response.resultValue.TotalCount;
            this.roleCurrentPage = event.page + 1;
          }
        }
      )
    }
  }

  //添加新角色
  addRoleSubmit() {
    this.hasSubmit = true;
    this.showAddRoleDialog = false;
    const roleFormVal = this.roleForm.value;
    let role = new m_role();
    role.name = roleFormVal.name;
    role.order_no = 1;
    role.auditstat = 1;
    role.description = roleFormVal.description;
    role.creator_id = this.currentUser.id;
    this.roleSerivce.addRole(role).subscribe((response) => {
      this.hasSubmit = false;
      if (response.resultValue.RCode === environment.success_code) {
        //跳转到第一页
      }
    });
  }

  //角色已有权限组弹出框
  rolePermissionGroupsDialog(role_id: number) {
    this.role_id = role_id;
    this.permissionGroupsCurrentPage = 1;
    this.roleSerivce.getRolePermissionGroups(role_id, 1, this.itemsPerPage)
      .subscribe((response) => {
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
          this.permissionGroupsArray = response.resultValue.Data;
          this.permissionGroupsTotalCount = response.resultValue.TotalCount;
          this.showPermissionGroupsDialog = true;
        }
      });
  }

  //角色添加权限组
  addRolePermissionGroupsDialog(role_id: number) {
    this.role_id = role_id;
    this.addPermissionGroupsSelectionArray = [];
    this.roleSerivce.getRoleDoNotHavePermissionGroups(role_id)
      .subscribe((response) => {
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
          this.doNotHavePermissionGroupsArray = response.resultValue.Data;
          this.showAddPermissionGroupsDialog = true;
        }
      })
  }

  //给角色添加新权限组
  addPermissionGroupsSubmit(role_id: number) {
    this.hasSubmit = true;
    let permissionGroupIdArray: string = '';
    _(this.addPermissionGroupsSelectionArray).forEach((n) => {
      permissionGroupIdArray += n.id + ',';
    });
    this.roleSerivce.addRolePermissionGroups(role_id, permissionGroupIdArray, this.addPermissionGroupsSelectionArray.length, this.currentUser.id)
      .subscribe((response) => {
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data === true) {

        }
        this.showAddPermissionGroupsDialog = false;
        this.hasSubmit = false;
      });
  }

  //角色所拥有的权限组分页
  permissionGroupsPaginate(event) {
    if (event && event.page >= 0) {
      this.roleSerivce.getRolePermissionGroups(this.role_id, event.page + 1, this.itemsPerPage)
        .subscribe((response) => {
          if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
            this.permissionGroupsArray = response.resultValue.Data;
            this.permissionGroupsTotalCount = response.resultValue.TotalCount;
            this.permissionGroupsCurrentPage = event.page + 1;
          }
        });
    }
  }
}
