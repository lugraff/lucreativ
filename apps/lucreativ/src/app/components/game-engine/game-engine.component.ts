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
import { IsMobileScreenService } from '@shared/util-screen';
import { BehaviorSubject, Observable, Subscription, take } from 'rxjs';
import { CanComponentDeactivate, FPSService } from '@shared/util-global';
import { Action, Actions, Gamestatus } from './entities';
import { GameService } from './game.service';
import { ButtonGameComponent, ButtonStandardComponent, PopupComponent } from '@shared/ui-global';
import { Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'lucreativ-canvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonStandardComponent, ButtonGameComponent, PopupComponent],
  providers: [GameService, FPSService],
  templateUrl: './game-engine.component.html',
})
export class GameEngineComponent implements AfterViewInit, OnDestroy, CanComponentDeactivate {
  private canvas: HTMLCanvasElement | undefined = undefined;
  private ctx: CanvasRenderingContext2D | undefined = undefined;
  private canvasBG: HTMLCanvasElement | undefined = undefined;
  private ctxBG: CanvasRenderingContext2D | undefined = undefined;
  private subs: Subscription[] = [];
  public showMenuPopup = false;
  public showExitPopup = false;
  private desiredRoute = '';
  public processing = new BehaviorSubject<boolean>(false);
  public gamestatus: Gamestatus = { fps: 0, tick: -32, nextFrame: false, windowSize: { x: 100, y: 100 } };
  private actionA: Action = { isPressed: false };
  private actionB: Action = { isPressed: false };
  private actionLeft: Action = { isPressed: false };
  private actionUp: Action = { isPressed: false };
  private actionDown: Action = { isPressed: false };
  private actionRight: Action = { isPressed: false };
  private actions: Actions = {
    actionA: this.actionA,
    actionB: this.actionB,
    actionLeft: this.actionLeft,
    actionUp: this.actionUp,
    actionDown: this.actionDown,
    actionRight: this.actionRight,
  };
  private bgMusic = new Audio();

  //TODO Joystick Button
  //TODO Start Screen
  //TODO Bug Behavior Speed, Dash, +Animations

  constructor(
    private router: Router,
    private game: GameService,
    private ngZone: NgZone,
    private detector: ChangeDetectorRef,
    public screenService: IsMobileScreenService,
    public fpsService: FPSService
  ) {
    this.subs.push(this.screenService.windowWidth$.subscribe((width) => (this.gamestatus.windowSize.x = width)));
    this.subs.push(this.screenService.windowHeight$.subscribe((height) => (this.gamestatus.windowSize.y = height)));
    this.subs.push(
      game.stopGame.subscribe(() => {
        if (this.processing.value == true) {
          this.bgMusic.pause();
          this.bgMusic.currentTime = 0;
          this.showMenuPopup = true;
          this.processing.next(false);
          this.detector.markForCheck();
        }
      })
    );
  }

  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    // console.log(event.code);
    if (event.code === 'Escape') {
      this.processing.next(!this.processing.value);
      // } else if (event.code === 'Space') {
      //   this.actionA.isPressed = true;
      // } else if (event.code === 'ArrowRight') {
      //   //
    }
  }
  // @HostListener('window:keyup', ['$event']) onKeyUp(event: KeyboardEvent) {
  //   if (event.code === 'Space') {
  //     this.actionA.isPressed = false;
  //   }
  // }
  // @HostListener('window:keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
  //   if (event.code === 'Space') {
  //     this.actionA.isPressed = true;
  //   }
  // }
  public setToFullscreen(): void {
    //->Service!
    const elem = document.body as HTMLElement;
    const methodToBeInvoked = elem.requestFullscreen;
    if (methodToBeInvoked) {
      methodToBeInvoked.call(elem);
    }
  }

  public onActionA(isPressed: boolean): void {
    this.actionA.isPressed = isPressed;
  }
  public onActionB(isPressed: boolean): void {
    this.actionB.isPressed = isPressed;
  }
  public onActionLeft(isPressed: boolean): void {
    this.actionLeft.isPressed = isPressed;
  }
  public onActionUp(isPressed: boolean): void {
    this.actionUp.isPressed = isPressed;
  }
  public onActionDown(isPressed: boolean): void {
    this.actionDown.isPressed = isPressed;
  }
  public onActionRight(isPressed: boolean): void {
    this.actionRight.isPressed = isPressed;
  }

  public ngAfterViewInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvasBG = document.getElementById('canvasBG') as HTMLCanvasElement;
    this.ctxBG = this.canvasBG.getContext('2d') as CanvasRenderingContext2D;
    this.bgMusic.src = 'assets/game/track01.mp3';
    this.bgMusic.load();
    this.subs.push(this.processing.subscribe(() => this.ngZone.runOutsideAngular(() => this.process(0))));
    this.subs.push(
      this.fpsService.$fps.subscribe((fps) => {
        this.gamestatus.fps = fps;
        //this.detector.markForCheck();
      })
    );
    this.game.loadingFinished$.pipe(take(1)).subscribe(() => {
      this.drawStatic();
      this.showMenuPopup = true;
      this.detector.markForCheck();
    });
  }

  public onStartGame(): void {
    this.drawStars();
    this.bgMusic.play();
    this.showMenuPopup = false;
    this.processing.next(true);
  }

  private drawStatic(): void {
    if (!this.canvasBG || !this.ctxBG) {
      return;
    }
    this.ctxBG.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const node of this.game.staticNodes) {
      let nodeSize = node.sprite.tileSize;
      if (nodeSize === undefined) {
        nodeSize = { x: 0, y: 0 };
      }
      this.ctxBG.drawImage(
        node.sprite.img,
        0,
        0,
        nodeSize.x,
        nodeSize.y,
        node.position.x,
        node.position.y,
        nodeSize.x * 0.5,
        nodeSize.y * 0.5
      );
    }
    // this.ctxBG.beginPath();
    // this.ctxBG.moveTo(0, 240);
    // this.ctxBG.lineTo(320, 240);
    // this.ctxBG.stroke();
  }
  private drawStars(): void {
    if (!this.canvasBG || !this.ctxBG) {
      return;
    }
    this.ctxBG.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.ctxBG.lineWidth = 1;
    this.ctxBG.strokeStyle = 'white';
    for (let index = 0; index < 30; index++) {
      this.ctxBG.strokeRect(Math.random() * 320, Math.random() * 120, 0.5, 0.5);
    }
  }

  private process(timestamp: number): void {
    if (!this.processing.value || !this.canvas || !this.ctx) {
      return;
    }
    this.fpsService.calcFPS(timestamp);
    if (this.gamestatus.tick++ > 7000) {
      this.gamestatus.tick = 0;
    }
    this.ctx.clearRect(0, 0, 320, 240);

    this.gamestatus.nextFrame = false;
    if (this.gamestatus.tick % 7 === 0) {
      this.gamestatus.nextFrame = true;
    }
    for (const node of this.game.nodes) {
      this.game.runNode(this.ctx, this.gamestatus, node, this.actions);
    }

    requestAnimationFrame((timestamp) => this.process(timestamp));
  }

  public myCanDeactivate(nextState: RouterStateSnapshot | undefined): boolean | Observable<boolean> | Promise<boolean> {
    if (this.processing.value) {
      if (nextState !== undefined) {
        this.processing.next(false);
        this.desiredRoute = nextState.url;
        this.showExitPopup = true;
        this.detector.markForCheck();
      }
      return false;
    }
    return true;
  }
  public onQuit(): void {
    this.router.navigate([this.desiredRoute]);
  }
  public onContinue(): void {
    this.showExitPopup = false;
    this.processing.next(true);
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
    this.bgMusic.pause();
  }
}
