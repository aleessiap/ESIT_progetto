import { Injectable } from '@angular/core';
import { Access } from '../../../server/models/access'
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  constructor(private http: HttpClient) { }

  getAllAccess(): Observable<Access[]> {

    return this.http.get<Access[]>('http://localhost:8000/api/access')

  }

  getAccess(id: string): Observable<Access> {

    return this.http.get<Access>('http://localhost:8000/api/access/' + id)
  }

  insertAccess(access: Access): Observable<Access> {

    return this.http.post<Access>('http://localhost:8000/api/access/', access)

  }

  updateAccess(access: Access): Observable<void> {

    return this.http.put<void>('http://localhost:8000/api/access/' + access.id, access)

  }

  deleteAccess(id: string) {

    return this.http.delete('http://localhost:8000/api/access/' + id)

  }

}
