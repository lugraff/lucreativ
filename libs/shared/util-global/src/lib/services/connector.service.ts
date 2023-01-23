import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectorService {
  constructor(private http: HttpClient) {}

  private addHeaders(securityKey: string = '', apiKey: string = ''): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Cache-Control', 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0');
    if (apiKey.length) {
      headers = headers.append('Api-key', apiKey);
    }
    if (securityKey.length) {
      headers = headers.append('security-key', securityKey);
    }
    return headers;
  }

  public create(apiKey: string, data: string, securityKey: string = ''): Observable<any> {
    return this.http.post<any>('https://json.extendsclass.com/bin', data, {
      headers: this.addHeaders(securityKey, apiKey),
    });
  }

  public getAll(apiKey: string): Observable<any> {
    return this.http.get<any>('https://json.extendsclass.com/bins', { headers: this.addHeaders('', apiKey) });
  }

  public getFile(id: string, securityKey: string = ''): Observable<any> {
    return this.http.get<any>('https://json.extendsclass.com/bin/' + id, { headers: this.addHeaders(securityKey) });
  }

  public delete(id: string, securityKey: string = ''): Observable<any> {
    return this.http.delete<any>('https://json.extendsclass.com/bin/' + id, { headers: this.addHeaders(securityKey) });
  }
}
