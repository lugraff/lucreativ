import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectorService {
  constructor(private http: HttpClient) {}

  public post(address: string, data: object = {}): Observable<any> {
    return this.http.post<any>(address, data);
  }
  public get(address: string): Observable<any> {
    return this.http.get<any>(address);
  }
  public delete(address: string): Observable<any> {
    return this.http.delete<any>(address);
  }
}
