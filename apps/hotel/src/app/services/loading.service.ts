import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private animTimer = 0;
  private isLoading$$ = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoading$$.asObservable();
  public loadingDurationinMS = 0;

  public setLoading(isLoading: boolean): void {
    if (isLoading) {
      if (this.animTimer === 0) {
        this.animTimer = window.setInterval(() => {
          this.loadingDurationinMS += 100;
        }, 100);
      }
    } else {
      clearInterval(this.animTimer);
      this.loadingDurationinMS = 0;
    }
    this.isLoading$$.next(isLoading);
  }
}
