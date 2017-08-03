import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {UserService} from './user.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private userService: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> {

    let canActivate = this.userService.hasAccessToken.take(1);
    if (!canActivate) {
      this.router.navigateByUrl('login');
    }
    return canActivate;
  }
}
