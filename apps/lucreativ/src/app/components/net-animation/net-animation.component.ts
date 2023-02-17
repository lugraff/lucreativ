import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MouseEventService, TouchEventService, Vector2 } from '@shared/util-global';
import { IsMobileScreenService } from '@shared/util-screen';
import { FormsModule } from '@angular/forms';
import {
  ButtonListComponent,
  ButtonStandardComponent,
  InputStandardComponent,
  PopupComponent,
  TooltipDirective,
} from '@shared/ui-global';
import { BehaviorSubject, Subscription } from 'rxjs';

export interface Ball {
  pos: Vector2;
  dir: Vector2;
  speed: number;
  radius: number;
}

@Component({
  selector: 'lucreativ-net-animation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonStandardComponent,
    ButtonListComponent,
    PopupComponent,
    TooltipDirective,
    InputStandardComponent,
  ],
  templateUrl: './net-animation.component.html',
})
export class NetAnimationComponent implements AfterViewInit, OnDestroy {
  private canvas: HTMLCanvasElement | undefined = undefined;
  private mousePos: Vector2 = { x: 0, y: 0 };
  private subs: Subscription[] = [];
  public processing = new BehaviorSubject<boolean>(true);
  public connectDist = 140;
  public dots = 100;
  public minSpeed = 0;
  public maxSpeed = 2;
  public range = 100;
  public damping = 0.05;
  public showSettings = true;
  public isTouching = false;
  public lineWidth = 1;
  
  public fps = 0;
  private fpsStack: number[] = [];
  private lastDelta = 0;
  private interval = 0;

  private balls: Ball[] = [];

  //TODO Spiegelung
  //TODO Refactoring
  //TODO AUTO FPS
  //TODO mouse und touch service zusammenlegen

  @HostListener('window:keydown', ['$event']) onKey(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.onTogglePlaying();
    } else if (event.code === 'Enter') {
      this.onReload();
    } else if (event.code === 'KeyS') {
      this.showSettings = !this.showSettings;
    }
  }

  constructor(
    private ngZone: NgZone,
    private detector: ChangeDetectorRef,
    public screenService: IsMobileScreenService,
    mouseService: MouseEventService,
    touchService: TouchEventService
  ) {
    if (screenService.isMobile) {
      this.subs.push(
        touchService.touchStart.subscribe((event) => {
          this.mousePos = { x: event.touches[0].clientX, y: event.touches[0].clientY };
          this.isTouching = true;
        })
      );
      this.subs.push(
        touchService.touchMove.subscribe((event) => {
          this.mousePos = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        })
      );
      this.subs.push(
        touchService.touchEnd.subscribe(() => {
          this.isTouching = false;
        })
      );
    } else {
      this.subs.push(
        mouseService.mouseMove.subscribe((event) => (this.mousePos = { x: event.clientX, y: event.clientY }))
      );
    }
    for (let index = 0; index < this.dots; index++) {
      const newBall: Ball = {
        pos: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
        dir: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
        speed: Math.random() * this.maxSpeed,
        radius: Math.random() * 2 + 1,
      };
      this.balls.push(newBall);
    }
    this.interval = setInterval(() => {
      this.detector.markForCheck();
    }, 400);
  }

  public ngAfterViewInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.processing.subscribe(() => this.ngZone.runOutsideAngular(() => this.process()));
  }

  onTogglePlaying() {
    this.processing.next(!this.processing.value);
  }

  public setToFullscreen(): void {
    const elem = document.body as HTMLElement;
    const methodToBeInvoked = elem.requestFullscreen;
    if (methodToBeInvoked) {
      methodToBeInvoked.call(elem);
    }
  }

  private calcFPS(delta: number): void {
    this.fpsStack.push(delta - this.lastDelta);
    this.lastDelta = delta;
    this.fps = Math.round((1 / (this.fpsStack.reduce((a, b) => a + b, 0) / this.fpsStack.length)) * 1000);
    if (this.fpsStack.length > 9) {
      this.fpsStack.splice(0, 1);
    }
  }

  private process(delta: number = 0): void {
    if (!this.processing.value || !this.canvas) {
      return;
    }
    this.calcFPS(delta);

    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if ((this.screenService.isMobile && this.isTouching) || !this.screenService.isMobile) {
      for (const ball of this.balls) {
        this.calcMouseGravity(ball);
      }
    }

    for (const ball of this.balls) {
      this.calcBallPos(ball);
    }
    // for (const ball of this.balls) {
    //   this.paintBall(ctx, ball);
    // }

    // ctx.strokeStyle = '#ffffffff';
    // ctx.fillStyle = '#00ff00aa';
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = 'round';
    // ctx.lineJoin = 'round';
    for (let index = 0; index < this.balls.length; index++) {
      this.paintLine(ctx, index);
    }

    // ctx.fill();
    requestAnimationFrame((val) => this.process(val));
  }

  private calcMouseGravity(ball: Ball): void {
    const distance = Math.sqrt(
      (ball.pos.x - this.mousePos.x) * (ball.pos.x - this.mousePos.x) +
        (ball.pos.y - this.mousePos.y) * (ball.pos.y - this.mousePos.y)
    );
    if (distance < this.range) {
      ball.speed += this.range * 0.001;
      if (ball.speed > this.maxSpeed) {
        ball.speed = this.maxSpeed;
      }
    } else {
      if (ball.speed > this.minSpeed) {
        ball.speed -= this.damping;
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
        ctx.beginPath();
        ctx.strokeStyle = `rgba(
          ${distance * 4},
          255,
          ${distance * 4},
          ${(this.connectDist - distance) / this.connectDist})`;
        this.net(ctx, posSelf, index);
        // this.kraken(ctx, posSelf, index);
        // this.rects(ctx, posSelf, index);
        // this.flower(ctx, posSelf, index);
        ctx.stroke();
        // ctx.save();
        // ctx.scale(-1, 1);
        // ctx.restore();
        // ctx.stroke();
      }
    }
  }

  private flower(ctx: CanvasRenderingContext2D, posSelf: Vector2, index: number): void {
    ctx.moveTo(posSelf.x, posSelf.y);
    ctx.bezierCurveTo(
      innerWidth * 0.5,
      0,
      innerWidth * 0.5,
      innerHeight,
      this.balls[index].pos.x,
      this.balls[index].pos.y
    );
  }

  private kraken(ctx: CanvasRenderingContext2D, posSelf: Vector2, index: number): void {
    ctx.moveTo(posSelf.x, posSelf.y);
    ctx.bezierCurveTo(
      innerWidth * 0.5,
      innerHeight * 0.5,
      posSelf.x,
      posSelf.y,
      this.balls[index].pos.x,
      this.balls[index].pos.y
    );
  }

  private net(ctx: CanvasRenderingContext2D, posSelf: Vector2, index: number): void {
    ctx.moveTo(posSelf.x, posSelf.y);
    ctx.lineTo(this.balls[index].pos.x, this.balls[index].pos.y);
  }

  private rects(ctx: CanvasRenderingContext2D, posSelf: Vector2, index: number): void {
    ctx.rect(posSelf.x, posSelf.y, this.balls[index].pos.x, this.balls[index].pos.y);
  }

  onReload() {
    if (this.dots > 1) {
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
  }

  public ngOnDestroy(): void {
    this.processing.next(false);
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
    clearInterval(this.interval);
  }
}
