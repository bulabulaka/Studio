import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/index';
import {userModel} from '../../../shared/index';
import {EventBusService} from '../shared/index';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  public isCollapse = false;
  public currentUser: userModel;

  constructor(private userService: UserService, private eventBusService: EventBusService) {

  }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (response) => {
        this.currentUser = response;
      }
    );

    this.eventBusService.topToggleBtn.subscribe(value => {
      this.toggleMenuStatus(value);
    })

  }

  private toggleMenuStatus(isCollapse: boolean) {
    this.isCollapse = isCollapse;
  }

}
