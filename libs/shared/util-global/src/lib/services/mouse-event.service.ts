import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MouseEventService {
  mouseLastEvent = new BehaviorSubject<MouseEvent | undefined>(undefined);
  mouseMove = new Subject<MouseEvent>();
  mouseUp = new Subject<MouseEvent>();
  mouseDown = new Subject<MouseEvent>();

  constructor() {
    window.addEventListener('mousedown', (event) => {
      this.mouseDown.next(event);
      this.mouseLastEvent.next(event);
    });
    window.addEventListener('mousemove', (event) => {
      this.mouseMove.next(event);
      this.mouseLastEvent.next(event);
    });
    window.addEventListener('mouseup', (event) => {
      this.mouseUp.next(event);
      this.mouseLastEvent.next(event);
    });
  }
}
