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
    // debugger
    return this.httpClient.post(this.url +"employee/getTodayEmp",'');
  }

  getTotalDarwer(empID): Observable<any>{
    return this.httpClient.get('http://localhost/eSafe-gasoline_station/src/assets/api/drawer/getTotalDarwer', {params:{empID:empID}});
  }
  getDetailInvoice(data): Observable<any>{
    return this.httpClient.post('http://localhost/eSafe-gasoline_station/src/assets/api/invoice/getDetailInvoice', data);
  }
}
