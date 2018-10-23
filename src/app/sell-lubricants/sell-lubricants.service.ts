import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SellLubricantsService {
  private url="http://localhost/eSafe-gasoline_station/src/assets/api/";
  constructor(private httpClient:HttpClient) { }

  getLubricant(limit,offset){
    let data={'limit':limit,'offset':offset};
    return this.httpClient.post(this.url +"stock/getLubricant",data);
  }
  sellLubricants(sellLubData){
    console.log(sellLubData)
    return this.httpClient.post(this.url +"operation/sell",sellLubData);
  }
}
