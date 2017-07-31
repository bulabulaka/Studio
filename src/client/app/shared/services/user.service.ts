import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable, BehaviorSubject, Subject, ReplaySubject} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ApiService} from './api.service';
import {User} from '../models/user.model';


@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService, private http: Http) {
  }

  login(credentials): Observable<User> {
    return this.apiService.post('/auth/login', {username: credentials.username, password: credentials.password})
      .map(data => {
        this.currentUserSubject.next(data);
        this.isAuthenticatedSubject.next(true);
        return data;
      })
  }
}
