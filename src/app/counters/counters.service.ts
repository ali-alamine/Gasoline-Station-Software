import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountersService {

  constructor(private httpClient: HttpClient) { }

  getAllDispanesersCounters(){
    return this.httpClient.get('http://localhost/eSafe-gasoline_station/src/assets/api/dispanser/getDispanserCounters');
  }
}
