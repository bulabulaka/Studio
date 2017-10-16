import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/index';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hasSubmit: boolean;
  formErrors = {
    'username': '',
    'password': ''
  };

  //Error info
  validationMessages = {
    'username': {
      'required': '用户名不能为空',
      'usernameVaild': ''
    },
    'password': {
      'required': '密码不能为空'
    }
  };


  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) {
    this.loginForm = this.formBuilder.group({
      'username': ['',
        [Validators.required]
      ],
      'password': ['', Validators.required]
    });
    this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.hasSubmit = false;
  }

  ngOnInit() {
  }

  onValueChanged(data?: any) {
    if (!this.loginForm) {
      return;
    }
    const form = this.loginForm;

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
    const loginUser = this.loginForm.value;
    this.userService.login(loginUser.username, loginUser.password)
      .subscribe(response => {
        this.hasSubmit = false;
        if (response.resultValue.RCode === environment.success_code && response.resultValue.Data && response.resultValue.Token) {
          const token = response.resultValue.Token;
          this.userService.saveToken(token);
          this.userService.getCurrentUserInfo().subscribe((response) => {
              if (response.resultValue.RCode === environment.success_code) {
                this.router.navigateByUrl('workspace');
              }
            }
          );
        }
      })
  }
}
