import {Component, OnInit} from '@angular/core';
import {UserService} from './shared/index';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.checkAccessToken();
  }

}
