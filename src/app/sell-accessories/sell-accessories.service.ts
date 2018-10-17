import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SellAccessoriesService {
  private url="http://localhost/gasolineStation/src/assets/api/";
  constructor(private httpClient:HttpClient) { }

  getAccessories(limit,offset){
    let data={'limit':limit,'offset':offset};
    return this.httpClient.post(this.url +"stock/getAccessories",data);
  }
  sellAccessories(data){
    return this.httpClient.post(this.url +"operation/sell",data);
  }
}