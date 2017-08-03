import {Injectable} from '@angular/core';
import {Headers, Http, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {environment} from '../../../environments/environment';
import {NgCookieService} from './cookie.service';


@Injectable()
export class ApiService {
  constructor(private http: Http, private cookieService: NgCookieService) {
  }

  setHeaders(): Headers {
    let headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-access-token': this.cookieService.getCookie(environment.cookie_key)
    };
    return new Headers(headersConfig);
  }

  private formatErrors(error: any) {
    return Observable.throw(error.json());
  }

  get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
    return this.http.get(
      `${environment.api_url}${path}`, {headers: this.setHeaders(), search: params}
    )
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${environment.api_url}${path}`, JSON.stringify(body), {headers: this.setHeaders()}
    )
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`, JSON.stringify(body), {headers: this.setHeaders()}
    )
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment}${path}`, {headers: this.setHeaders()}
    )
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

}
