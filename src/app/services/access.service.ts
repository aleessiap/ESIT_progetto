import { Injectable } from '@angular/core';
import { Access } from '../../../server/models/access'
import { HttpClient} from '@angular/common/http';
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AccessService {

  constructor(private http: HttpClient) { }

  getAllAccess(): Observable<Access[]> {
    return this.http.get<Access[]>('/api/access')
  }

  getAccess(_id: string): Observable<Access> {
    return this.http.get<Access>('/api/access/' + _id)
  }

  getAccessByDoorId(_id: string): Observable<Access> {
    return this.http.get<Access>('/api/access/door/' + _id)
  }

  getAccessByDoorIdAndUserId(door_id: string, user_id:string | null): Observable<Access> {
    return this.http.get<Access>('/api/access/door/' + door_id + '/' + user_id)
  }


  insertAccess(access: Access): Observable<Access> {
    return this.http.post<Access>('/api/access', access)
  }

  updateAccess(access: Access): Observable<Access> {
    return this.http.put<Access>('/api/access', access)
  }

  deleteAccess(_id: string) {
    return this.http.delete('/api/access/' + _id)
  }

}
