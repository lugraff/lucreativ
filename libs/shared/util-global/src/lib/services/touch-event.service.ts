import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TouchEventService {
  touchStart = new Subject<TouchEvent>();
  touchMove = new Subject<TouchEvent>();
  touchEnd = new Subject<TouchEvent>();
  touchCancel = new Subject<TouchEvent>();

  constructor() {
    window.addEventListener('touchstart', (event) => {
      this.touchStart.next(event);
    });
    window.addEventListener('touchmove', (event) => {
      this.touchStart.next(event);
    });
    window.addEventListener('touchend', (event) => {
      this.touchStart.next(event);
    });
    window.addEventListener('touchcancel', (event) => {
      this.touchStart.next(event);
    });
  }
}
