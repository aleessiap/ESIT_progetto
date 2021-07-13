import { TestBed } from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  uri:'http://localhost:8000/';
  constructor(private http: HttpClient){
  }
  access(username:string, password:string){
    return this.http.get(this.uri + 'login/' + username);
 }
});
