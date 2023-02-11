import { AfterViewInit, Component, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vector2 } from '@shared/util-global';

@Component({
  selector: 'lucreativ-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  private canvas: HTMLCanvasElement | undefined = undefined;
  private processing = false;
  private posBall: Vector2 = { x: 50, y: 50 };
  private dir: Vector2 = { x: 1, y: 1 };
  private speed = 6;

  constructor(private ngZone: NgZone) {}

  public ngAfterViewInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;

    this.processing = true;
    this.ngZone.runOutsideAngular(() => this.process());
  }

  private process(): void {
    if (!this.processing || !this.canvas) {
      return;
    }
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, 1200, 600);

    this.posBall.x += this.dir.x * this.speed;
    this.posBall.y += this.dir.y * this.speed;
    this.speed = 5;
    if (this.posBall.y < 0) {
      this.dir.y = 1;
    } else if (this.posBall.y > 600) {
      this.dir.y = -1;
    }
    if (this.posBall.x < 0) {
      this.dir.x = 1;
    } else if (this.posBall.x > 1200) {
      this.dir.x = -1;
    }
    this.paintBall(ctx, this.posBall);

    requestAnimationFrame(() => this.process());
  }

  private paintBall(ctx: CanvasRenderingContext2D, posBall: Vector2): void {
    ctx.fillStyle = 'white';
    const circle = new Path2D();
    circle.arc(posBall.x, posBall.y, 16, 0, 2 * Math.PI);
    ctx.fill(circle);
  }

  public ngOnDestroy(): void {
    this.processing = false;
  }
}
