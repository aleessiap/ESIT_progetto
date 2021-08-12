import { Injectable } from '@angular/core';
import { Authorization } from '../../../server/models/authorization'
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private http:HttpClient) { }

  getAllAuthorizations(): Observable<Authorization[]>{

    return this.http.get<Authorization[]>('http://localhost:8000/api/authorizations')

  }

  getAllNotAuthorized(): Observable<Authorization[]>{

    return this.http.get<Authorization[]>('http://localhost:8000/api/authorizations/denied')

  }

  getAuthorizations(name: string): Observable<Authorization> {

    return this.http.get<Authorization>('http://localhost:8000/api/authorizations/' + name)

  }

  getNotAuthorized(name: string): Observable<Authorization> {

    return this.http.get<Authorization>('http://localhost:8000/api/authorizations/denied/' + name)

  }


  insertAuthorization(door_name: string, user_name: string): Observable<Authorization> {

    return this.http.post<Authorization>('http://localhost:8000/api/authorizations', {door_name: door_name, user_name: user_name});

  }

  updateAuthorizations(name: string, old_pin:string, new_pin:string): Observable<void> {

    return this.http.put<void>('http://localhost:8000/api/authorizations', {name: name, old_pin: old_pin, new_pin: new_pin})

  }

  deleteAuthorizations(name: string, pin: string) {

    return this.http.delete('http://localhost:8000/api/authorizations/' + name + '/' + pin)

  }


}
