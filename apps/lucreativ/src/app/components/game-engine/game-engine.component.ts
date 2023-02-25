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
import { BehaviorSubject, Subscription } from 'rxjs';
import { FPSService } from '@shared/util-global';
import { Action, Gamestatus } from './entities';
import { GameService } from './game.service';

@Component({
  selector: 'lucreativ-canvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [GameService, FPSService],
  templateUrl: './game-engine.component.html',
})
export class GameEngineComponent implements AfterViewInit, OnDestroy {
  private canvas: HTMLCanvasElement | undefined = undefined;
  private ctx: CanvasRenderingContext2D | undefined = undefined;
  private canvasBG: HTMLCanvasElement | undefined = undefined;
  private ctxBG: CanvasRenderingContext2D | undefined = undefined;
  private subs: Subscription[] = [];
  public processing = new BehaviorSubject<boolean>(false);
  public gamestatus: Gamestatus = { fps: 0, tick: -32, windowSize: { x: 100, y: 100 } };
  private actionA: Action = { isPressed: false };

  //TODO Jump und Stand -> other Animations changeability

  constructor(
    private ngZone: NgZone,
    private detector: ChangeDetectorRef,
    public screenService: IsMobileScreenService,
    public fpsService: FPSService,
    private game: GameService
  ) {
    this.subs.push(this.screenService.windowWidth$.subscribe((width) => (this.gamestatus.windowSize.x = width)));
    this.subs.push(this.screenService.windowHeight$.subscribe((height) => (this.gamestatus.windowSize.y = height)));
  }

  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    // console.log(event.code);
    if (event.code === 'Escape') {
      this.processing.next(!this.processing.value);
    } else if (event.code === 'Space') {
      this.actionA.isPressed = true;
    } else if (event.code === 'ArrowRight') {
      //
    }
  }
  @HostListener('window:keyup', ['$event']) onKeyUp(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.actionA.isPressed = false;
    }
  }
  @HostListener('window:keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.actionA.isPressed = true;
    }
  }

  public ngAfterViewInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvasBG = document.getElementById('canvasBG') as HTMLCanvasElement;
    this.ctxBG = this.canvasBG.getContext('2d') as CanvasRenderingContext2D;
    this.subs.push(this.processing.subscribe(() => this.ngZone.runOutsideAngular(() => this.process(0))));
    this.subs.push(
      this.fpsService.$fps.subscribe((fps) => {
        this.gamestatus.fps = fps;
        this.detector.markForCheck();
      })
    );
    setTimeout(() => {
      this.drawStatic();
      this.processing.next(true);
    }, 200);
  }

  private drawStatic(): void {
    if (!this.canvasBG || !this.ctxBG) {
      return;
    }
    this.ctxBG.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const node of this.game.staticNodes) {
      this.ctxBG.drawImage(
        node.sprite.img,
        0,
        0,
        node.sprite.tileSize.x,
        node.sprite.tileSize.y,
        node.position.x,
        node.position.y,
        node.sprite.tileSize.x * 0.5,
        node.sprite.tileSize.y * 0.5
      );
    }
    this.ctxBG.strokeStyle = 'white';
    this.ctxBG.lineWidth = 1;
    this.ctxBG.beginPath();
    this.ctxBG.moveTo(0, 232);
    this.ctxBG.lineTo(480, 232);
    this.ctxBG.stroke();
  }

  private process(timestamp: number): void {
    if (!this.processing.value || !this.canvas || !this.ctx) {
      return;
    }
    this.fpsService.calcFPS(timestamp);
    if (this.gamestatus.tick++ > 1000) {
      this.gamestatus.tick = 0;
    }
    this.ctx.clearRect(0, 0, 480, 360 );

    for (const node of this.game.nodes) {
      if (this.gamestatus.tick % node.sprite.tiles.x === 0) {
        node.frame++;
      }
      if (node.frame >= node.sprite.tiles.x) {
        node.frame = 0;
      }

      if (node.script) {
        this.game.runScript(this.gamestatus, node.script, node, this.actionA);
      }

      this.ctx.drawImage(
        node.sprite.img,
        node.frame * node.sprite.tileSize.x,
        node.sprite.tileSize.y,
        node.sprite.tileSize.x,
        node.sprite.tileSize.y,
        node.position.x,
        node.position.y,
        node.sprite.tileSize.x,
        node.sprite.tileSize.y
      );
    }

    requestAnimationFrame((timestamp) => this.process(timestamp));
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
