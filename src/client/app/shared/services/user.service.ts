import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable, BehaviorSubject, Subject, ReplaySubject} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ApiService} from './api.service';
import {m_user} from '../../../../shared/models/index';
import {ResultValue} from '../../../../shared/models/index';
import {environment} from '../../../environments/environment';


@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<m_user>(new m_user());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService, private http: Http) {
  }

  login(username: string, password: string): Observable<{ resultValue: ResultValue<m_user> }> {
    return this.apiService.post('/auth/login', {username: username, password: password})
      .map(data => {
        if (data.resultValue.RCode === environment.success_code && data.resultValue.Data) {
          this.currentUserSubject.next(data.resultValue.Data);
        }
        return data;
      })
  }
}
