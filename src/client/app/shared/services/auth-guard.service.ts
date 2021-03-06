import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, ReplaySubject} from 'rxjs/Rx';
import {UserService} from './user.service';
import * as _ from 'lodash';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private userService: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> {

    const hasLogin = this.userService.hasAccessToken.take<boolean>(1);
    if (!hasLogin) {
      this.router.navigateByUrl('login');
      return hasLogin;
    } else {
      /*have login*/
      /*checkout user permission*/
      return new Observable((observer) => {
        this.userService.currentUser.subscribe(u => {
          if (!_.isEmpty(u.permissionList)) {
            if (_.find(u.permissionList, (p) => {
                return _.toUpper(p.method) === 'GET' && _.toUpper(p.route) === _.toUpper(state.url);
              })) {
              observer.next(true);
              observer.complete();
              return;
            }
            this.router.navigateByUrl('no_permission');
            observer.next(false);
            observer.complete();
            return;
          }
          this.router.navigateByUrl('no_permission');
          observer.next(false);
          observer.complete();
          return;
        });
      });
    }
  }
}
