import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public getItem(key: string): any {
    if (navigator.cookieEnabled) {
      return localStorage.getItem(key);
    }
    return null;
  }

  public setItem(key: string, data: string): void {
    if (navigator.cookieEnabled) {
      localStorage.setItem(key, data);
    }
  }

  public removeItem(key: string): void {
    if (navigator.cookieEnabled) {
      localStorage.removeItem(key);
    }
  }

  public clear(): void {
    if (navigator.cookieEnabled) {
      localStorage.clear();
    }
  }
}
