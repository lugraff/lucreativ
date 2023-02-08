import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public getItem(key: string, session: boolean = false): any {
    if (navigator.cookieEnabled) {
      if (session) {
        return sessionStorage.getItem(key);
      } else {
        return localStorage.getItem(key);
      }
    }
    return null;
  }

  public setItem(key: string, data: string, session: boolean = false): void {
    if (navigator.cookieEnabled) {
      if (session) {
        sessionStorage.setItem(key, data);
      } else {
        localStorage.setItem(key, data);
      }
    }
  }

  public removeItem(key: string, session: boolean = false): void {
    if (navigator.cookieEnabled) {
      if (session) {
        sessionStorage.removeItem(key);
      } else {
        localStorage.removeItem(key);
      }
    }
  }

  public clear(session: boolean = false): void {
    if (navigator.cookieEnabled) {
      if (session) {
        sessionStorage.clear();
      } else {
        localStorage.clear();
      }
    }
  }
}
