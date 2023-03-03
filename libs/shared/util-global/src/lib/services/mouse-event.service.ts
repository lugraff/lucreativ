import { Injectable } from '@angular/core';
import { IsMobileScreenService } from '@shared/util-screen';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MouseEventService {
  mouseLastEvent = new BehaviorSubject<MouseEvent | undefined>(undefined);
  mouseMove = new Subject<MouseEvent>();
  mouseUp = new Subject<MouseEvent>();
  mouseDown = new Subject<MouseEvent>();

  constructor(public machineInfoService: IsMobileScreenService) {
    if (machineInfoService.isMobile) {
      console.log('Touch');
      window.addEventListener('touchstart', (event) => {
        this.mouseDown.next(new MouseEvent('mouseDown', this.emulateEvent(event.changedTouches[0])));
      });
      window.addEventListener('touchmove', (event) => {
        this.mouseDown.next(new MouseEvent('mousemove', this.emulateEvent(event.changedTouches[0])));
      });
      window.addEventListener('touchend', (event) => {
        this.mouseDown.next(new MouseEvent('mouseup', this.emulateEvent(event.changedTouches[0])));
      });
    } else {
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

  private emulateEvent(touch: Touch): MouseEventInit {
    const emulatedEvent: MouseEventInit = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      relatedTarget: touch.target,
      screenX: touch.screenX,
      screenY: touch.screenY,
    };
    return emulatedEvent;
  }
}
