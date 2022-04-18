import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor(private httpClient: HttpClient) { }
  getDrawerDetails(shiftID): Observable<any>{
    // tslint:disable-next-line: max-line-length
    return this.httpClient.get('http://localhost/gasoline-station-software/src/assets/api/apx/controllers/drawer/getDrawerDetails', {params:{shiftID:shiftID}});
  }
}
