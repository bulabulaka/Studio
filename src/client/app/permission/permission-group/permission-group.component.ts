import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {Router} from '@angular/router';
import {flyIn} from '../../shared/index';
import {PermissionService, UserService} from '../../shared/index';
import {permission, m_user, m_permission_group} from '../../../../shared/index';
import {environment} from '../../../environments/environment';
import * as _ from 'lodash';

@Component({
  selector: 'app-permission-group',
  templateUrl: './permission-group.component.html',
  styleUrls: ['./permission-group.component.scss'],
  animations: [
    flyIn
  ]
})
export class PermissionGroupComponent implements OnInit {

  public displayDialog: boolean = false;
  public showPermissionsDialog: boolean = false;
  public showAddPermissionsDialog: boolean = false;
  public currentUser: m_user;
  public permissionGroupArray: m_permission_group[] = [];
  public permissionArray: permission[] = [];//权限组已拥有的权限
  public doNotHavePermissionArray: permission[] = []; //权限组为拥有的权限
  public addPermissionsSelectionArray: permission[] = [];
  public permissionGroupsCurrentPage = 1;
  public currentPage = 1;
  public itemsPerPage = 10;//分页大小
  public permissionsTotalCount = 0;
  public permissionGroupsTotalCount = 0;
  public pg_id: number;//current permission group id;

  permissionGroupForm: FormGroup;
  hasSubmit: boolean;
  formErrors = {
    'name': '',
    'description': ''
  };

  //Error info
  validationMessages = {
    'name': {
      'required': '权限组名不能为空'
    },
    'description': {}
  };

  constructor(private router: Router, private formBuilder: FormBuilder, private permissionService: PermissionService, private userService: UserService) {
    this.permissionGroupForm = this.formBuilder.group({
      'name': ['',
        [Validators.required]
      ],
      'description': ['']
    });
    this.permissionGroupForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.hasSubmit = false;
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (response) => {
        this.currentUser = response;
      }
    );
    this.permissionService.getPermissionGroups(this.permissionGroupsCurrentPage, this.itemsPerPage).subscribe(
      (response) => {
        this.permissionGroupArray = response.resultValue.Data;
        this.permissionGroupsTotalCount = response.resultValue.TotalCount;
      }
    );
  }

  //添加权限组弹出框
  addPermissionGroupDialog() {
    this.displayDialog = true;
  }

  //权限组已有权限弹出框
  permissionGroupPermissionsDialog(pg_id: number) {
    this.pg_id = pg_id;
    this.permissionService.getPermissionGroupPermissions(pg_id, 1, this.itemsPerPage)
      .subscribe((response) => {
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
          this.permissionArray = response.resultValue.Data;
          this.permissionsTotalCount = response.resultValue.TotalCount;
          this.showPermissionsDialog = true;
        }
      });
  }

  //权限组添加权限弹出框
  addPermissionGroupPermissionsDialog(pg_id: number) {
    this.pg_id = pg_id;
    this.addPermissionsSelectionArray = [];
    this.permissionService.getPermissionGroupDoNotHavePermissions(pg_id)
      .subscribe((response) => {
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
          this.doNotHavePermissionArray = response.resultValue.Data;
          this.showAddPermissionsDialog = true;
        }
      });
  }

  onValueChanged(data?: any) {
    if (!this.permissionGroupForm) {
      return;
    }
    const form = this.permissionGroupForm;

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

  //添加新的权限组
  onSubmit() {
    this.hasSubmit = true;
    this.displayDialog = false;
    const permissionGroupFormVal = this.permissionGroupForm.value;
    let permissionGroup = new m_permission_group();
    permissionGroup.name = permissionGroupFormVal.name;
    permissionGroup.order_no = 1;
    permissionGroup.auditstat = 1;
    permissionGroup.description = permissionGroupFormVal.description;
    permissionGroup.creator_id = this.currentUser.id;
    this.permissionService.addPermissionGroup(permissionGroup).subscribe((response) => {
      this.hasSubmit = false;
      if (response.resultValue.RCode === environment.success_code) {
        //跳转到第一页
      }
    });
  }

  //给权限组添加新权限
  addPermissionSubmit(pg_id: number) {
    this.hasSubmit = true;
    let permissionIdArray: string = '';
    _(this.addPermissionsSelectionArray).forEach((n) => {
      permissionIdArray += n.id + ',';
    });
    this.permissionService.addPermissionGroupPermissions(pg_id, permissionIdArray, this.addPermissionsSelectionArray.length, this.currentUser.id)
      .subscribe((response) => {
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {

        }
        this.showAddPermissionsDialog = false;
        this.hasSubmit = false;
      });
  }

  //权限组所拥有的权限分页
  permissionsPaginate(event) {
    if (event && event.page >= 0) {
      this.permissionService.getPermissionGroupPermissions(this.pg_id, event.page + 1, this.itemsPerPage)
        .subscribe((response) => {
          if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
            this.permissionArray = response.resultValue.Data;
            this.permissionsTotalCount = response.resultValue.TotalCount;
            this.currentPage = event.page + 1;
          }
        });
    }
  }

  //权限组分页
  permissionGroupsPaginate(event) {
    if (event && event.page >= 0) {
      this.permissionService.getPermissionGroups((event.page + 1), this.itemsPerPage).subscribe(
        (response) => {
          if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
            this.permissionGroupArray = response.resultValue.Data;
            this.permissionGroupsTotalCount = response.resultValue.TotalCount;
            this.permissionGroupsCurrentPage = event.page + 1;
          }
        }
      )
    }
  }

}
