import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  /* check loggin authentication */
  checkAuth(data){
    var jsonData=JSON.stringify(data);
    return this.httpClient.get('http://localhost:4200/eSafe-gasoline_station/src/assets/api/employee/checkLogin/',{params:{'data':jsonData}});
     
  }
}