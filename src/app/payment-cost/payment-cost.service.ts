import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PaymentCostService {
  private url="http://localhost/eSafe-gasoline_station/src/assets/api/";
  constructor(private httpClient:HttpClient) { }

  addPaymentCostInvoice(data){
    return this.httpClient.post(this.url +"operation/addPaymentCostInvoice",data);
  }
}
