import { AfterViewInit, Component, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vector2 } from '@shared/util-global';
import { IsMobileScreenService } from '@shared/util-screen';

export interface Ball {
  pos: Vector2;
  dir: Vector2;
  speed: number;
}

@Component({
  selector: 'lucreativ-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  private canvas: HTMLCanvasElement | undefined = undefined;
  private processing = false;

  private balls: Ball[] = [
    // { pos: { x: 50, y: 50 }, dir: { x: 1, y: 1 }, speed: 5 },
    // { pos: { x: 10, y: 150 }, dir: { x: -1, y: 1 }, speed: 4 },
  ];

  constructor(private ngZone: NgZone, public screenService: IsMobileScreenService) {
    for (let index = 0; index < 100; index++) {
      const newBall: Ball = {
        pos: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
        dir: { x: Math.random()-0.5, y: Math.random()-0.5 },
        speed: Math.random() * 1 + 3,
      };
      this.balls.push(newBall);
    }
  }

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
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const ball of this.balls) {
      this.calcBallPos(ball);
    }
    for (const ball of this.balls) {
      this.paintBall(ctx, ball.pos);
    }

    requestAnimationFrame(() => this.process());
  }

  private calcBallPos(ball: Ball): void {
    ball.pos.x += ball.dir.x * ball.speed;
    ball.pos.y += ball.dir.y * ball.speed;
    ball.speed += Math.random() * 0.1;
    if (ball.speed < 0) {
      ball.speed = 1;
    } else if (ball.speed > 2) {
      ball.speed = 1;
    }
    if (ball.pos.y < 0) {
      ball.dir.y = 1;
    } else if (ball.pos.y > window.innerHeight) {
      ball.dir.y = -1;
    }
    if (ball.pos.x < 0) {
      ball.dir.x = 1;
    } else if (ball.pos.x > window.innerWidth) {
      ball.dir.x = -1;
    }
  }

  private paintBall(ctx: CanvasRenderingContext2D, posBall: Vector2): void {
    ctx.fillStyle = '#aabb22';
    const circle = new Path2D();
    circle.arc(posBall.x, posBall.y, 6, 0, 2 * Math.PI);
    ctx.fill(circle);
  }

  public ngOnDestroy(): void {
    this.processing = false;
  }
}
