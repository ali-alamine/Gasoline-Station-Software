import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor(private httpClient: HttpClient) { }
  getDrawerDetails(shiftID): Observable<any>{
    return this.httpClient.get('http://localhost/eSafe-gasoline_station/src/assets/api/drawer/getDrawerDetails', {params:{shiftID:shiftID}});
  }
}
