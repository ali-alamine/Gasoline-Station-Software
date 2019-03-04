import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsReportServicesService {
  private url="http://localhost/eSafe-gasoline_station/src/assets/api/";
  constructor(private httpClient:HttpClient) { }

  getAllEmployees(){
    return this.httpClient.post(this.url +"employee/getAllEmp",'');
  }
  getPaymentReportResult(data){
    console.log(data)
    return this.httpClient.post(this.url +"report/getPaymentReportResult",{"data":data});
  }
}
