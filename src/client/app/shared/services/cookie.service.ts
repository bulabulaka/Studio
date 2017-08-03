import {Injectable} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';


@Injectable()
export class NgCookieService {


  constructor(private cookieService: CookieService) {
  }

  getCookie(key: string) {
    if (key) {
      return this.cookieService.get(key);
    } else {
      return null;
    }
  }

  setCookie(key: string, token: string) {
    if (key && token) {
      this.cookieService.put(key, token);
    }
  }

  destoryCookie(key: string) {
    this.cookieService.remove(key);
  }
}

