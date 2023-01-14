import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieHandlerService {
  public getAll(): string {
    return document.cookie;
  }

  public getCookie(cookieName: string): string {
    const name = cookieName + '=';
    const fullCookies = decodeURIComponent(document.cookie);
    const splittedCookies = fullCookies.split(';');
    for (let i = 0; i < splittedCookies.length; i++) {
      let cookieElement = splittedCookies[i];
      while (cookieElement.charAt(0) == ' ') {
        cookieElement = cookieElement.substring(1);
      }
      if (cookieElement.indexOf(name) == 0) {
        return cookieElement.substring(name.length, cookieElement.length);
      }
    }
    return '';
  }

  public setCookie(cookieName: string, cookieValue: string, expireDays: number): void {
    const date = new Date();
    date.setTime(date.getTime() + expireDays * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = cookieName + '=' + cookieValue + ';' + expires + ';path=/';
  }

  public deleteCookie(cookieName: string): void {
    document.cookie = cookieName + '=;';
  }
}
