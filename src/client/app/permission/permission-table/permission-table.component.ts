import {Component, OnInit} from '@angular/core';
import {flyIn} from '../../shared/index';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {PermissionService, UserService} from '../../shared/index';
import {permission, m_user} from '../../../../shared/index';
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

  numPages = 3;
  maxSize = 5;
  itemsPerPage = 5;
  totalItems = 15;
  currentPage = 1;

  public currentUser: m_user;
  permissionArray: permission[] = [];
  display: boolean = false;
  permissionForm: FormGroup;
  hasSubmit: boolean;
  formErrors = {
    'name': '',
    'method': '',
    'route': ''
  };

  //Error info
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

  constructor(private formBuilder: FormBuilder, private permissionService: PermissionService, private userService: UserService) {
    this.permissionForm = this.formBuilder.group({
      'name': ['',
        [Validators.required]
      ],
      'method': ['', Validators.required],
      'route': ['', Validators.required]
    });
    this.permissionForm.valueChanges.subscribe(data => this.onValueChanged(data));
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

  onSubmit() {
    this.hasSubmit = true;
    this.display = false;
    const permissionFormVal = this.permissionForm.value;
    let _permission = new permission();
    _permission.method = permissionFormVal.method;
    _permission.route = permissionFormVal.route;
    _permission.name = permissionFormVal.name;
    _permission.kind = 1;
    _permission.order_no = 1;
    _permission.auditstat = 1;
    _permission.description = '';
    _permission.creator_id = this.currentUser.id;
    this.permissionService.addPermission(_permission).subscribe((response) => {
      this.hasSubmit = false;
      if (response.resultValue.RCode === environment.success_code) {
        this.permissionArray.push(_permission);
      }
    });
  }

  showDialog() {
    this.display = true;
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (response) => {
        this.currentUser = response;
      }
    );
  }

  newPermission() {

  }

  blockUser(id: number) {

  }

  unBlockUser(id: number) {

  }

  resetPwd(id: number) {

  }

  pageChanged($event) {

  }

}
