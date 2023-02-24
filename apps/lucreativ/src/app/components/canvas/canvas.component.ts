import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsMobileScreenService } from '@shared/util-screen';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FPSService, Vector2 } from '@shared/util-global';

interface Gamestatus {
  fps: number;
  tick: number;
  windowSize: Vector2;
}

interface Spritesheet {
  img: HTMLImageElement;
  imgPath: string;
  tileSize: Vector2;
  tiles: Vector2;
}

interface Node {
  sprite: Spritesheet;
  frame: number;
  position: Vector2;
  groups?: string[];
}

@Component({
  selector: 'lucreativ-canvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
})
export class CanvasComponent implements AfterViewInit {
  private canvas: HTMLCanvasElement | undefined = undefined;
  private ctx: CanvasRenderingContext2D | undefined = undefined;
  private canvasBG: HTMLCanvasElement | undefined = undefined;
  private ctxBG: CanvasRenderingContext2D | undefined = undefined;
  private subs: Subscription[] = [];
  public processing = new BehaviorSubject<boolean>(false);
  public gamestatus: Gamestatus = { fps: 0, tick: -32, windowSize: { x: 100, y: 100 } };

  private startScreen: Node = {
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/CodeRannerLogo.png',
      tileSize: { x: 640, y: 480 },
      tiles: { x: 1, y: 1 },
    },
    frame: 0,
    position: { x: 80, y: 0 },
  };
  private player: Node = {
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/runner-sheet.png',
      tileSize: { x: 32, y: 32 },
      tiles: { x: 8, y: 3 },
    },
    frame: 0,
    position: { x: 80, y: 200 },
  };
  private bug: Node = {
    sprite: {
      img: new Image(),
      imgPath: 'assets/game/bug-sheet.png',
      tileSize: { x: 50, y: 50 },
      tiles: { x: 4, y: 4 },
    },
    frame: 0,
    position: { x: 380, y: 195 },
  };
  private staticNodes: Node[] = [this.startScreen];
  private nodes: Node[] = [this.player, this.bug];

  //TODO Jump und Stand -> other Animations changeability

  constructor(
    private ngZone: NgZone,
    private detector: ChangeDetectorRef,
    public screenService: IsMobileScreenService,
    public fpsService: FPSService
  ) {
    this.loadRecources();
    this.subs.push(this.screenService.windowWidth$.subscribe((width) => (this.gamestatus.windowSize.x = width)));
    this.subs.push(this.screenService.windowHeight$.subscribe((height) => (this.gamestatus.windowSize.y = height)));
  }

  @HostListener('window:keydown', ['$event']) onKey(event: KeyboardEvent) {
    console.log(event.code);
    if (event.code === 'Space') {
      this.processing.next(!this.processing.value);
    } else if (event.code === 'ArrowLeft') {
      //
    } else if (event.code === 'ArrowRight') {
      //
    }
  }

  private loadRecources(): void {
    for (const tex of this.staticNodes) {
      tex.sprite.img.src = tex.sprite.imgPath;
    }
    for (const tex of this.nodes) {
      tex.sprite.img.src = tex.sprite.imgPath;
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
      this.drawBG();
      this.processing.next(true);
    }, 200);
  }

  private drawBG(): void {
    if (!this.canvasBG || !this.ctxBG) {
      return;
    }
    this.ctxBG.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const node of this.staticNodes) {
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
    this.ctxBG.lineTo(640, 232);
    this.ctxBG.stroke();
  }

  private process(timestamp: number): void {
    if (!this.processing.value || !this.canvas || !this.ctx) {
      return;
    }
    this.fpsService.calcFPS(timestamp);
    if (this.gamestatus.tick++ > 640) {
      this.gamestatus.tick = -32;
    }

    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const node of this.nodes) {
      if (this.gamestatus.tick % node.sprite.tiles.x === 0) {
        node.frame++;
      }
      if (node.frame >= node.sprite.tiles.x) {
        node.frame = 0;
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
}
