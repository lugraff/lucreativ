import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MouseEventService {
  mouseMoveBehave = new BehaviorSubject<MouseEvent | undefined>(undefined);
  mouseMove = new Subject<MouseEvent>();
  mouseUp = new Subject<MouseEvent>();
  // mouseDown = new Subject<any>();

  constructor() {
    window.addEventListener('mousemove', (event) => {
      this.mouseMove.next(event);
      this.mouseMoveBehave.next(event);
    });
    window.addEventListener('mouseup', (event) => {
      this.mouseUp.next(event);
    });
    // window.addEventListener('mousedown', (event) => {
    //   this.mouseDown.next(event);
    // });
  }
}
