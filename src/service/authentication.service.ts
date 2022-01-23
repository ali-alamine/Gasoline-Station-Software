import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GloableService} from '../service/gloable.service';
import {Http, URLSearchParams, Headers, Response} from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  static endpoint = '/employee/checkLogin/';
  constructor(private httpClient: HttpClient, public gloableServ: GloableService) { }
  /* check loggin authentication */
  checkAuth(data) {
    // tslint:disable-next-line: prefer-const
    let jsonData = JSON.stringify(data);
    // let input = new FormData();
    // input.append('data')
    return this.httpClient.get(GloableService.PUBLIC_URL, {params: {'data': jsonData}});
  }
}
