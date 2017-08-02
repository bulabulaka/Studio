import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/index';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {environment} from '../../environments/environment';
import {CookieService} from 'angular2-cookie/core';

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
      'required': '',
      'usernameVaild': ''
    },
    'password': {
      'required': ''
    }
  };


  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private cookieService: CookieService) {
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
        if (response.resultValue.RCode === environment.success_code) {
          // window.location.href = '/api/user';
          let token = response.resultValue.Data;
          this.cookieService.put(environment.cookie_key, token);
          this.userService.getCurrentUserInfo().subscribe(response => {
            console.log(response);
          })
        }
        console.log(response);
      })
  }
}
