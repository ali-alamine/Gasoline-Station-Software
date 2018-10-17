import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  private url="http://localhost/gasolineStation/src/assets/api/";
  constructor(private httpClient:HttpClient) { }

  getSoldLubricants(){
    return this.httpClient.get(this.url +"invoice/getSoldLubricants");
  }
}
