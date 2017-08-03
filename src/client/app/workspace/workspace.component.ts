import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/index';
import {m_user} from '../../../shared/index'

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  currentUser: m_user;

  constructor(private userService: UserService) {

  }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (response) => {
        this.currentUser = response;
        console.log(this.currentUser);
      }
    )
  }

}
