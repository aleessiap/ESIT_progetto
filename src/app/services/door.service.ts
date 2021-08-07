import { Injectable } from '@angular/core';
import { Door } from '../../../server/models/door'
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DoorService {

  constructor(private http: HttpClient) { }

  getAllDoors(): Observable<Door[]> {

    return this.http.get<Door[]>('http://localhost:8000/api/doors')
  }

  getDoor(name: string): Observable<Door> {

    return this.http.get<Door>('http://localhost:8000/api/doors/' + name)
  }

  insertDoor(door: Door): Observable<Door> {

    return this.http.post<Door>('http://localhost:8000/api/doors/', door)

  }

  updateDoor(door: Door): Observable<void> {

    return this.http.put<void>('http://localhost:8000/api/doors/' + door.name, door)

  }

  deleteDoor(name: string) {

    return this.http.delete('http://localhost:8000/api/doors/' + name)

  }

}
