import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class WashingCarService {

  private url="http://localhost/gasoline-station-software/src/assets/api/";
  constructor(private httpClient:HttpClient) { }
  // sellWashService(data){
  //   console.log(data)
  //   return this.httpClient.post(this.url +"operation/sellWashService",data);
  // }
  sellWashService(data){
    // console.log(sellLubData)
    return this.httpClient.post(this.url +"operation/sellWashService",data);
  }
}
