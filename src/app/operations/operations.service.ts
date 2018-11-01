import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor(private httpClient: HttpClient) { }
  getTotalDarwer(empID): Observable<any>{
    return this.httpClient.get('http://localhost/eSafe-gasoline_station/src/assets/api/drawer/getTotalDarwer', {params:{empID:empID}});
  }
}
