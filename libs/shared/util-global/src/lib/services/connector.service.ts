import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectorService {
  constructor(private http: HttpClient) {}

  public post(address: string, data: object = {}): Observable<any> {
    return this.http.post<any>(address, data);
  }
  public get(address: string, key: string = ''): Observable<any> {
    let headers = new HttpHeaders();
    if (key !== '' && key.length === 37) {
      headers = headers.append('Api-key', key);
    }
    return this.http.get<any>(address, { headers: headers });
  }
  public delete(address: string): Observable<any> {
    return this.http.delete<any>(address);
  }
}
