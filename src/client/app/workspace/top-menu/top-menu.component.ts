import {Component, OnInit, Input} from '@angular/core';
import {m_user} from '../../../../shared/index'
import {EventBusService} from '../../shared/index';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  @Input() currentUser: m_user;
  toggleBtnStatus = false;
  public showTopMenu = false;

  constructor(private eventBusService: EventBusService) {
  }

  ngOnInit() {
  }

  public onToggleClick(event) {
    event.stopPropagation();
    this.toggleBtnStatus = !this.toggleBtnStatus;
    this.eventBusService.topToggleBtn.next(this.toggleBtnStatus);
  }

}
