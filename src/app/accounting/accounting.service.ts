import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  private url="http://localhost/eSafe-gasoline_station/src/assets/api/";
  constructor(private httpClient:HttpClient) { }

  getSoldLubricants(){
    return this.httpClient.get(this.url +"invoice/getSoldLubricants");
  }
  getTodayEmp(){
    return this.httpClient.post(this.url +"employee/getTodayEmp",'');
  }
  getDetailInvoice(data): Observable<any>{
    return this.httpClient.post(this.url +"invoice/getDetailInvoice", data);
  }
  deleteInvoice(data):Observable<any>{  
    console.log(data) 
    return this.httpClient.put(this.url+"invoice/deleteInvoice",data);
  }
}
