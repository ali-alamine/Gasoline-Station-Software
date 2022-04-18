import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PaymentCostService {
  private url="http://localhost/gasoline-station-software/src/assets/api/";
  constructor(private httpClient:HttpClient) { }

  addPaymentCostInvoice(data){
    console.log("payment cost data");
    console.log(data)
    return this.httpClient.post(this.url +"operation/addPaymentCostInvoice",data);
  }
}
