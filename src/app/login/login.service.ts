import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  /* check loggin authentication */
  checkAuth(data){
    // debugger;
    console.log(data)
    var jsonData=JSON.stringify(data);
    // return this.httpClient.post('http://localhost/eSafe-gasoline_station/src/assets/api/employee/checkLogin/',data);
    return this.httpClient.get('http://localhost/eSafe-gasoline_station/src/assets/api/employee/checkLogin/',{params:{'data':jsonData}});
  }
}
