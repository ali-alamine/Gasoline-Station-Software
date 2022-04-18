import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SellAccessoriesService {
  private url="http://localhost/gasoline-station-software/src/assets/api/";
  constructor(private httpClient:HttpClient) { }

  getAccessories(limit,offset){
    let data={'limit':limit,'offset':offset};
    return this.httpClient.post(this.url +"stock/getAccessories",data);
  }
  addInvoice(data){
    return this.httpClient.post(this.url +"operation/addInvoice",data);
  }
}