import {Component, OnInit, HostListener} from '@angular/core';
import {EventBusService} from '../../../shared/index';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  public menus = [
    {
      id: '1',
      name: '权限管理',
      isOpen: false,
      icon: 'fa-home',
      children: [
        {name: '权限管理', icon: 'fa-send', route: 'permission/permission_table'},
        {name: '权限组管理', icon: 'fa-send', route: 'permission/permission_group'}
      ]
    }
  ];

  public isCollapse = false;

  constructor(private eventBusService: EventBusService) {
  }

  ngOnInit() {
    this.eventBusService.topToggleBtn.subscribe(value => {
      this.toggleMenuAll(value);
    });
  }

  private toggleMenuAll(isCollapse: boolean) {
    this.isCollapse = isCollapse;
    this.menus.forEach(item => {
      item.isOpen = false;
    })
  }

  public toggleMenuItem(event, menu) {
    menu.isOpen = !menu.isOpen;
    //折叠状态下只能打开一个二级菜单层
    if (this.isCollapse) {
      let tempId = menu.id;
      this.menus.forEach(item => {
        if (item.id !== tempId) {
          item.isOpen = false;
        }
      });
    }
  }

  @HostListener('body:click', ['$event'])
  public onBodyClick(event) {
    if (this.isCollapse && (event.clientX > 75)) {
      this.menus.forEach(item => {
        item.isOpen = false;
      })
    }
  }
}
