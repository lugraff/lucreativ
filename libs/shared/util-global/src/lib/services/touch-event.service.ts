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
      console.log(event);
      this.touchMove.next(event);
    });
    window.addEventListener('touchend', (event) => {
      this.touchEnd.next(event);
    });
    window.addEventListener('touchcancel', (event) => {
      this.touchCancel.next(event);
    });
  }
}
