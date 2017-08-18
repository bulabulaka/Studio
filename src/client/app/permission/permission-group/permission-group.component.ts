import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {Router} from '@angular/router';
import {flyIn} from '../../shared/index';
import {PermissionService, UserService} from '../../shared/index';
import {permission, m_user, m_permission_group} from '../../../../shared/index';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-permission-group',
  templateUrl: './permission-group.component.html',
  styleUrls: ['./permission-group.component.scss'],
  animations: [
    flyIn
  ]
})
export class PermissionGroupComponent implements OnInit {

  public display: boolean = false;
  public showPermissions: boolean = false;
  public currentUser: m_user;
  public permissionGroupArray: m_permission_group[] = [];
  public permissionArray: permission[] = [];
  public permissionGroupsCurrentPage = 1;
  public currentPage = 1;
  public itemsPerPage = 10;//分页大小
  public permissionsTotalCount = 0;
  public permissionGroupsTotalCount = 0;
  private pg_id: number;

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

  showAddPermissionGroupDialog() {
    this.display = true;
  }

  ShowPermissionGroupPermissionsDialog(pg_id: number) {
    this.pg_id = pg_id;
    this.permissionService.getPermissionGroupPermissions(pg_id, 1, this.itemsPerPage)
      .subscribe((response) => {
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
          this.permissionArray = response.resultValue.Data;
          this.permissionsTotalCount = response.resultValue.TotalCount;
          this.showPermissions = true;
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
    this.display = false;
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
