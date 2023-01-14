import { Inject, Injectable } from '@angular/core';

export const INJECTION_TOKEN_IS_MOCK = 'IsMockData';
@Injectable({
  providedIn: 'root',
})
export class MockSettingsService {
  constructor(@Inject(INJECTION_TOKEN_IS_MOCK) isMockMode: boolean = false) {
    this.isMockMode = isMockMode;
  }
  public readonly mockDataDelay = 200;
  public isMockMode = false;
}
