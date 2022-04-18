import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class GloableService {
  public static PUBLIC_URL ='http://localhost/gasoline-station-software/src/assets/api';

  public static URL_USER_LOGIN= GloableService.PUBLIC_URL+'/employee/checkLogin/';
}
