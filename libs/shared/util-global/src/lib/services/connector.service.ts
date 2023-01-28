import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectorService {
  constructor(private http: HttpClient) {}

  private addHeaders(securityKey: string = '', apiKey: string = '', patch: boolean = false): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Cache-Control', 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0');
    if (patch) {
      headers = headers.append('Content-type', 'application/json-patch+json');
    }
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
    return this.http.get<any>('https://json.extendsclass.com/bins', {
      observe: 'response',
      headers: this.addHeaders('', apiKey),
    });
  }

  public getFile(id: string, securityKey: string = ''): Observable<any> {
    return this.http.get<any>('https://json.extendsclass.com/bin/' + id, { headers: this.addHeaders(securityKey) });
  }

  public delete(id: string, securityKey: string = ''): Observable<any> {
    return this.http.delete<any>('https://json.extendsclass.com/bin/' + id, { headers: this.addHeaders(securityKey) });
  }

  public overwrite(id: string, data: string, securityKey: string = ''): Observable<any> {
    return this.http.put<any>('https://json.extendsclass.com/bin/' + id, data, {
      headers: this.addHeaders(securityKey),
    });
  }

  public patch(id: string, operator: string, path: string, data: string, securityKey: string = ''): Observable<any> {
    return this.http.patch<any>(
      'https://json.extendsclass.com/bin/' + id,
      '[{"op":"' + operator + '","path":"' + path + data + '"}]',
      {
        headers: this.addHeaders(securityKey, '', true),
      }
    );
  }
}
