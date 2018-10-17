import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class WashingCarService {

  private url="http://localhost/gasolineStation/src/assets/api/";
  constructor(private httpClient:HttpClient) { }
  sellWashService(data){
    return this.httpClient.post(this.url +"operation/sellWashService",data);
  }
}
