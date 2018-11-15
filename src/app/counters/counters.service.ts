import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountersService {
  private url="http://localhost/eSafe-gasoline_station/src/assets/api/";
  constructor(private httpClient: HttpClient) { }

  getAllDispanesersCounters(){
    return this.httpClient.get(this.url+'dispanser/getDispanserCounters');
  }
  submitCounters(data){
    console.log("data")
    console.log(data)
    console.log("data")
    return this.httpClient.post(this.url+'dispanser/submit_counters',data);
  }
}
