import { Injectable } from '@angular/core';
import { IsMobileScreenService } from '@shared/util-screen';
import { Subject } from 'rxjs';
import { Vector2 } from '../entities/vector2';

export interface Pointer {
  position: Vector2;
  index: number;
  pressed: boolean | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class PointerEventService {
  public pointerPosition = new Subject<Pointer>();
  public ongoingPointers: Pointer[] = [];

  constructor(public screenService: IsMobileScreenService) {
    if (screenService.isMobile) {
      window.addEventListener('touchstart', (event) => {
        const touches = event.changedTouches;
        for (let i = 0; i < touches.length; i++) {
          const newTouch = touches.item(i);
          if (newTouch !== null) {
            this.pointerPosition.next({
              position: { x: newTouch.clientX, y: newTouch.clientY },
              index: newTouch.identifier,
              pressed: true,
            });
            this.addToList({
              position: { x: newTouch.clientX, y: newTouch.clientY },
              index: newTouch.identifier,
              pressed: true,
            });
          }
        }
      });
      window.addEventListener('touchmove', (event) => {
        const touches = event.changedTouches;
        for (let i = 0; i < touches.length; i++) {
          const newTouch = touches.item(i);
          if (newTouch !== null) {
            this.pointerPosition.next({
              position: { x: newTouch.clientX, y: newTouch.clientY },
              index: newTouch.identifier,
              pressed: undefined,
            });
            this.addToList({
              position: { x: newTouch.clientX, y: newTouch.clientY },
              index: newTouch.identifier,
              pressed: undefined,
            });
          }
        }
      });
      window.addEventListener('touchend', (event) => {
        const touches = event.changedTouches;
        for (let i = 0; i < touches.length; i++) {
          const newTouch = touches.item(i);
          if (newTouch !== null) {
            this.pointerPosition.next({
              position: { x: newTouch.clientX, y: newTouch.clientY },
              index: newTouch.identifier,
              pressed: false,
            });
            this.addToList({
              position: { x: newTouch.clientX, y: newTouch.clientY },
              index: newTouch.identifier,
              pressed: false,
            });
          }
        }
      });
      // window.addEventListener('touchcancel', (event) => {
      //   const touches = event.changedTouches;
      //   for (let i = 0; i < touches.length; i++) {
      //     const newTouch = touches.item(i);
      //     if (newTouch !== null) {
      //       this.pointerPosition.next({
      //         position: { x: newTouch.clientX, y: newTouch.clientY },
      //         index: newTouch.identifier,
      //         pressed: false,
      //       });
      //       this.addToList({
      //         position: { x: newTouch.clientX, y: newTouch.clientY },
      //         index: newTouch.identifier,
      //         pressed: false,
      //       });
      //     }
      //   }
      // });
    } else {
      window.addEventListener('mousedown', (event) => {
        this.pointerPosition.next({ position: { x: event.clientX, y: event.clientY }, index: 0, pressed: true });
        this.addToList({ position: { x: event.clientX, y: event.clientY }, index: 0, pressed: true });
      });
      window.addEventListener('mousemove', (event) => {
        // this.mouseMove.next(event);
        // this.mouseLastEvent.next(event);
        this.pointerPosition.next({ position: { x: event.clientX, y: event.clientY }, index: 0, pressed: undefined });
        this.addToList({ position: { x: event.clientX, y: event.clientY }, index: 0, pressed: undefined });
      });
      window.addEventListener('mouseup', (event) => {
        // this.mouseUp.next(event);
        // this.mouseLastEvent.next(event);
        this.pointerPosition.next({ position: { x: event.clientX, y: event.clientY }, index: 0, pressed: false });
        this.addToList({ position: { x: event.clientX, y: event.clientY }, index: 0, pressed: false });
      });
    }
  }

  private addToList(event: Pointer) {
    if (this.ongoingPointers.length >= 10) {
      this.ongoingPointers.splice(10, 1);
    }
    this.ongoingPointers.push(event);
  }
}
