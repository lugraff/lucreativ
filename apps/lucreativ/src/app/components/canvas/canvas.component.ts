import { AfterViewInit, Component, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MouseEventService, TouchEventService, Vector2 } from '@shared/util-global';
import { IsMobileScreenService } from '@shared/util-screen';
import { FormsModule } from '@angular/forms';
import { ButtonListComponent, ButtonStandardComponent } from '@shared/ui-global';

export interface Ball {
  pos: Vector2;
  dir: Vector2;
  speed: number;
  radius: number;
}

@Component({
  selector: 'lucreativ-canvas',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonStandardComponent, ButtonListComponent],
  templateUrl: './canvas.component.html',
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  private canvas: HTMLCanvasElement | undefined = undefined;
  private processing = false;
  private mousePos: Vector2 = { x: 0, y: 0 };
  public connectDist = 140;
  public dots = 100;
  public minSpeed = 0;
  public maxSpeed = 2;
  public showSettings = true;

  private balls: Ball[] = [];

  constructor(private ngZone: NgZone, public screenService: IsMobileScreenService, touchService: TouchEventService) {
    touchService.touchMove.subscribe((event) => {
      console.log(event);
      event.preventDefault();
      this.mousePos = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    });
    for (let index = 0; index < this.dots; index++) {
      const newBall: Ball = {
        pos: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
        dir: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
        speed: Math.random() * this.maxSpeed,
        radius: Math.random() * 2 + 1,
      };
      this.balls.push(newBall);
    }
  }

  public ngAfterViewInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;

    this.processing = true;
    this.ngZone.runOutsideAngular(() => this.process());
  }

  public setToFullscreen(): void {
    const elem = document.body as HTMLElement;
    const methodToBeInvoked = elem.requestFullscreen;
    if (methodToBeInvoked) {
      methodToBeInvoked.call(elem);
    }
  }

  private process(): void {
    if (!this.processing || !this.canvas) {
      return;
    }
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const ball of this.balls) {
      this.calcMouseGravity(ball);
    }
    for (const ball of this.balls) {
      this.calcBallPos(ball);
    }
    // for (const ball of this.balls) {
    //   this.paintBall(ctx, ball);
    // }
    for (let index = 0; index < this.balls.length; index++) {
      this.paintLine(ctx, index);
    }
    requestAnimationFrame(() => this.process());
  }

  private calcMouseGravity(ball: Ball): void {
    const distance = Math.sqrt(
      (ball.pos.x - this.mousePos.x) * (ball.pos.x - this.mousePos.x) +
        (ball.pos.y - this.mousePos.y) * (ball.pos.y - this.mousePos.y)
    );
    if (distance < this.connectDist * 2) {
      ball.speed += distance * 0.001;
      if (ball.speed > this.maxSpeed) {
        ball.speed = this.maxSpeed;
      }
    } else {
      if (ball.speed > this.minSpeed) {
        ball.speed -= distance * 0.00005;
      } else {
        ball.speed = this.minSpeed;
      }
    }
  }

  private calcBallPos(ball: Ball): void {
    ball.pos.x += ball.dir.x * ball.speed;
    ball.pos.y += ball.dir.y * ball.speed;
    if (ball.pos.y < ball.radius) {
      ball.pos.y = ball.radius;
      ball.dir.y = -ball.dir.y;
    } else if (ball.pos.y + ball.radius > window.innerHeight) {
      ball.pos.y = window.innerHeight - ball.radius;
      ball.dir.y = -ball.dir.y;
    }
    if (ball.pos.x < ball.radius) {
      ball.pos.x = ball.radius;
      ball.dir.x = -ball.dir.x;
    } else if (ball.pos.x + ball.radius > window.innerWidth) {
      ball.pos.x = window.innerWidth - ball.radius;
      ball.dir.x = -ball.dir.x;
    }
  }

  private paintBall(ctx: CanvasRenderingContext2D, ball: Ball): void {
    ctx.fillStyle = '#ffffffaa';
    const circle = new Path2D();
    circle.arc(ball.pos.x, ball.pos.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill(circle);
  }

  private paintLine(ctx: CanvasRenderingContext2D, ballIndex: number): void {
    const posSelf: Vector2 = this.balls[ballIndex].pos;

    for (let index = ballIndex; index < this.balls.length; index++) {
      const posOther: Vector2 = this.balls[index].pos;
      const distance = Math.sqrt(
        (posSelf.x - posOther.x) * (posSelf.x - posOther.x) + (posSelf.y - posOther.y) * (posSelf.y - posOther.y)
      );
      if (distance < this.connectDist) {
        ctx.strokeStyle = `rgba(
          ${distance * 4},
          255,
          ${distance * 4},
          ${(this.connectDist - distance) / this.connectDist})`;
        ctx.beginPath();
        ctx.moveTo(posSelf.x, posSelf.y);
        ctx.lineTo(this.balls[index].pos.x, this.balls[index].pos.y);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  onReload() {
    this.balls = [];
    for (let index = 0; index < this.dots; index++) {
      const newBall: Ball = {
        pos: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
        dir: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
        speed: Math.random() * this.maxSpeed,
        radius: Math.random() * 2 + 1,
      };
      this.balls.push(newBall);
    }
  }

  public ngOnDestroy(): void {
    this.processing = false;
  }
}
