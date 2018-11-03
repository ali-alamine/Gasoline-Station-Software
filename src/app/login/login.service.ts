import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  /* check loggin authentication */
  checkAuth(data): Observable<any>{
    // debugger;
    // console.log(data)
    // var jsonData=JSON.stringify(data);
    // return this.httpClient.post('http://localhost/eSafe-gasoline_station/src/assets/api/employee/checkLogin/',data);
    return this.httpClient.post('http://localhost/eSafe-gasoline_station/src/assets/api/employee/checkLogin/',data);//{params:{'data':jsonData}}
  }
}
