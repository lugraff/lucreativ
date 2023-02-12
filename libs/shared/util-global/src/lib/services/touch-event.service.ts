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
  public ongoingTouches: Touch[] = [];

  constructor() {
    window.addEventListener('touchstart', (event) => {
      this.touchStart.next(event);
      this.addToList(event);
    });
    window.addEventListener('touchmove', (event) => {
      this.touchMove.next(event);
      this.addToList(event);
    });
    window.addEventListener('touchend', (event) => {
      this.touchEnd.next(event);
      this.addToList(event);
    });
    window.addEventListener('touchcancel', (event) => {
      this.touchCancel.next(event);
      this.addToList(event);
    });
  }

  private addToList(event: TouchEvent) {
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const newTouch = touches.item(i);
      if (newTouch !== null) {
        if (this.ongoingTouches.length >= 10) {
          this.ongoingTouches.pop();
        }
        this.ongoingTouches.push(newTouch);
      }
    }
  }
}
