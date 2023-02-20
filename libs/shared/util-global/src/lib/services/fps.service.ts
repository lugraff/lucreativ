import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FPSService {
  private fps = new BehaviorSubject<number>(0);
  public $fps = this.fps.asObservable();
  private fpsStack: number[] = [];
  private lastDelta = 0;
  private valueCount = 20;

  public calcFPS(delta: number): void {
    this.fpsStack.push(delta - this.lastDelta);
    this.lastDelta = delta;
    if (this.fpsStack.length > this.valueCount) {
      this.fps.next(Math.round((1 / (this.fpsStack.reduce((a, b) => a + b, 0) / this.fpsStack.length)) * 1000));
      this.fpsStack = [];
    }
  }
}
