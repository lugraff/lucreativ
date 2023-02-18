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
import { PointerEventService, Vector2 } from '@shared/util-global';
import { IsMobileScreenService } from '@shared/util-screen';
import { FormsModule } from '@angular/forms';
import {
  ButtonListComponent,
  ButtonStandardComponent,
  InputStandardComponent,
  ListComponent,
  PopupComponent,
  TooltipDirective,
} from '@shared/ui-global';
import { BehaviorSubject, Subscription } from 'rxjs';

interface Dot {
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
    ListComponent,
  ],
  templateUrl: './net-animation.component.html',
})
export class NetAnimationComponent implements AfterViewInit, OnDestroy {
  private canvas: HTMLCanvasElement | undefined = undefined;
  private pointerPos: Vector2 = { x: 0, y: 0 };
  private subs: Subscription[] = [];
  public processing = new BehaviorSubject<boolean>(true);
  public connectDist = 100;
  public dotCount = 100;
  public minSpeed = 0.3;
  public maxSpeed = 4;
  public range = 150;
  public damping = 0.1;
  public lineWidth = 1.5;
  public showSettings = true;
  public isPressing = false;
  public style = 'net';
  public styles: string[] = ['net', 'kraken', 'flower', 'rects'];

  public autoFps = true;
  public fps = 0;
  private fpsStack: number[] = [];
  private lastDelta = 0;
  private interval = 0;
  private fpsChecks = 0;

  private dots: Dot[] = [];

  //TODO Spiegelung
  //TODO Refactoring

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
    pointerService: PointerEventService
  ) {
    this.subs.push(
      pointerService.pointerPosition.subscribe((event) => {
        this.pointerPos = { x: event.position.x, y: event.position.y };
        if (event.pressed !== undefined) {
          this.isPressing = event.pressed;
        }
        // event.index
      })
    );

    this.onReload();

    this.interval = setInterval(() => {
      this.detector.markForCheck();
    }, 400);
    this.interval = setInterval(() => {
      if (this.autoFps) {
        this.doAutoFPS();
      }
    }, 10);
  }

  public ngAfterViewInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.processing.subscribe(() => this.ngZone.runOutsideAngular(() => this.process()));
  }

  public onReload(): void {
    const sum = this.dotCount - this.dots.length;
    if (sum > 0) {
      this.onPushDot(sum);
    } else if (sum < 0) {
      for (let index = 0; index < Math.abs(sum); index++) {
        this.dots.pop();
      }
    }
  }

  private onPushDot(amount: number): void {
    for (let index = 0; index < amount; index++) {
      const newDot: Dot = {
        pos: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
        dir: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
        speed: Math.random() * this.maxSpeed,
        radius: Math.random() * 2 + 1,
      };
      this.dots.push(newDot);
    }
  }

  public onTogglePlaying(): void {
    this.processing.next(!this.processing.value);
  }

  onstartAutoCalc() {
    this.fpsChecks = 0;
    this.autoFps = true;
  }

  private doAutoFPS(): void {
    if (this.autoFps) {
      if (this.fps < 10) {
        this.dots = [];
      } else if (this.fps < 20) {
        for (let index = 0; index < 100; index++) {
          this.dots.pop();
        }
      } else if (this.fps < 30) {
        for (let index = 0; index < 50; index++) {
          this.dots.pop();
        }
      } else if (this.fps < 40) {
        for (let index = 0; index < 10; index++) {
          this.dots.pop();
        }
      } else if (this.fps < 55) {
        this.dots.pop();
        this.dots.pop();
        this.dots.pop();
      } else if (this.fps < 59) {
        this.fpsChecks++;
        if (this.fpsChecks > 30) {
          this.autoFps = false;
        }
      } else if (this.fps > 61) {
        this.onPushDot(100);
      } else if (this.fps > 60) {
        this.onPushDot(50);
      } else if (this.fps > 59) {
        this.onPushDot(10);
      }
    }
    this.dotCount = this.dots.length;
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

    if (this.isPressing) {
      for (const ball of this.dots) {
        this.calcMouseGravity(ball);
      }
    }

    for (const ball of this.dots) {
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
    for (let index = 0; index < this.dots.length; index++) {
      this.paintLine(ctx, index);
    }

    requestAnimationFrame((val) => this.process(val));
  }

  private calcMouseGravity(ball: Dot): void {
    const distance = Math.sqrt(
      (ball.pos.x - this.pointerPos.x) * (ball.pos.x - this.pointerPos.x) +
        (ball.pos.y - this.pointerPos.y) * (ball.pos.y - this.pointerPos.y)
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

  private calcBallPos(ball: Dot): void {
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

  private paintBall(ctx: CanvasRenderingContext2D, ball: Dot): void {
    ctx.fillStyle = '#ffffffaa';
    const circle = new Path2D();
    circle.arc(ball.pos.x, ball.pos.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill(circle);
  }

  private paintLine(ctx: CanvasRenderingContext2D, ballIndex: number): void {
    const posSelf: Vector2 = this.dots[ballIndex].pos;
    for (let index = ballIndex; index < this.dots.length; index++) {
      const posOther: Vector2 = this.dots[index].pos;
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
        if (this.style === this.styles[0]) {
          this.net(ctx, posSelf, index);
        } else if (this.style === this.styles[1]) {
          this.kraken(ctx, posSelf, index);
        } else if (this.style === this.styles[2]) {
          this.flower(ctx, posSelf, index);
        } else if (this.style === this.styles[3]) {
          this.rects(ctx, posSelf, index);
        }
        // ctx.fill();
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
      this.dots[index].pos.x,
      this.dots[index].pos.y
    );
  }

  private kraken(ctx: CanvasRenderingContext2D, posSelf: Vector2, index: number): void {
    ctx.moveTo(posSelf.x, posSelf.y);
    ctx.bezierCurveTo(
      innerWidth * 0.5,
      innerHeight * 0.5,
      posSelf.x,
      posSelf.y,
      this.dots[index].pos.x,
      this.dots[index].pos.y
    );
  }

  private net(ctx: CanvasRenderingContext2D, posSelf: Vector2, index: number): void {
    ctx.moveTo(posSelf.x, posSelf.y);
    ctx.lineTo(this.dots[index].pos.x, this.dots[index].pos.y);
  }

  private rects(ctx: CanvasRenderingContext2D, posSelf: Vector2, index: number): void {
    ctx.rect(posSelf.x, posSelf.y, this.dots[index].pos.x, this.dots[index].pos.y);
  }

  public ngOnDestroy(): void {
    this.processing.next(false);
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
    clearInterval(this.interval);
  }
}
