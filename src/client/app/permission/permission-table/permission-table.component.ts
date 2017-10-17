import {Component, OnInit} from '@angular/core';
import {flyIn} from '../../shared/index';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {PermissionService, UserService} from '../../shared/index';
import {PermissionModel, UserModel} from '../../../../shared/index';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-permission-table',
  templateUrl: './permission-table.component.html',
  styleUrls: ['./permission-table.component.scss'],
  animations: [
    flyIn
  ]
})
export class PermissionTableComponent implements OnInit {

  public itemsPerPage = 10;
  public currentPage = 1;
  public totalCount = 0;
  public readonly page = environment.page;
  public readonly service_api = environment.service_api;
  public currentUser: UserModel;
  permissionArray: PermissionModel[] = [];
  addPagePermissionShow = false;
  display = false;
  permissionForm: FormGroup;
  pagePermissionForm: FormGroup;
  hasSubmit: boolean;
  formErrors = {
    'name': '',
    'method': '',
    'route': ''
  };

  pagePermissionFormErrors = {
    'name': '',
    'route': ''
  };

  // Error info
  validationMessages = {
    'name': {
      'required': '权限名不能为空'
    },
    'method': {
      'required': '方法不能为空'
    },
    'route': {
      'required': '路由不能为空'
    }
  };

  constructor(private router: Router, private formBuilder: FormBuilder, private permissionService: PermissionService,
              private userService: UserService) {
    this.permissionForm = this.formBuilder.group({
      'name': ['',
        [Validators.required]
      ],
      'method': ['', Validators.required],
      'route': ['', Validators.required]
    });
    this.pagePermissionForm = this.formBuilder.group({
      'name': ['',
        [Validators.required]
      ],
      'route': ['', Validators.required]
    });
    this.permissionForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.pagePermissionForm.valueChanges.subscribe(data => this.onPageFormValueChanged(data));
    this.hasSubmit = false;
  }

  onValueChanged(data?: any) {
    if (!this.permissionForm) {
      return;
    }
    const form = this.permissionForm;

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

  onPageFormValueChanged(data?: any) {
    if (!this.pagePermissionForm) {
      return;
    }
    const form = this.pagePermissionForm;

    for (const field in this.pagePermissionFormErrors) {
      this.pagePermissionFormErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          if (!this.pagePermissionFormErrors[field]) {
            this.pagePermissionFormErrors[field] += messages[key] + ' ';
          } else {
            break;
          }
        }
      }
    }
  }

  onSubmit(kind: number) {
    this.hasSubmit = true;
    const _permission = new PermissionModel();
    if (kind === this.service_api) {
      this.display = false;
      const permissionFormVal = this.permissionForm.value;
      _permission.method = permissionFormVal.method;
      _permission.route = permissionFormVal.route;
      _permission.name = permissionFormVal.name;
    } else {
      this.addPagePermissionShow = false;
      const pagePermissionFormVal = this.pagePermissionForm.value;
      _permission.route = pagePermissionFormVal.route;
      _permission.name = pagePermissionFormVal.name;
      _permission.method = 'get';
    }
    _permission.kind = kind;
    _permission.order_no = 1;
    _permission.auditstat = 1;
    _permission.description = '';
    _permission.creator_id = this.currentUser.id;
    this.permissionService.addPermission(_permission).subscribe((response) => {
      this.hasSubmit = false;
      if (response.resultValue.RCode === environment.success_code) {
        // 跳转到第一页
      }
    });
  }

  showDialog() {
    this.display = true;
  }

  showAddPagePermission() {
    this.addPagePermissionShow = true;
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (response) => {
        this.currentUser = response;
      }
    );
    this.permissionService.getPermission(this.currentPage, this.itemsPerPage).subscribe(
      (response) => {
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
          this.permissionArray = response.resultValue.Data;
          this.totalCount = response.resultValue.TotalCount;
        }
      }
    )
  }

  // 分页
  paginate(event) {
    if (event && event.page >= 0) {
      this.permissionService.getPermission((event.page + 1), this.itemsPerPage).subscribe(
        (response) => {
          if (response.resultValue.RCode === environment.success_code && response.resultValue.Data) {
            this.permissionArray = response.resultValue.Data;
            this.totalCount = response.resultValue.TotalCount;
            this.currentPage = event.page + 1;
          }
        }
      )
    }
  }

  blockUser(id: number) {

  }

  unBlockUser(id: number) {

  }

  resetPwd(id: number) {

  }


}
