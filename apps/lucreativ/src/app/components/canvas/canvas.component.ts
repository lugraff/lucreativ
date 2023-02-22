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
  private subs: Subscription[] = [];
  public processing = new BehaviorSubject<boolean>(true);
  public gamestatus: Gamestatus = { fps: 0, tick: -32, windowSize: { x: 100, y: 100 } };

  private frame = 1;
  private bgTexture: Spritesheet = {
    img: new Image(),
    imgPath: 'assets/game/CodeRannerLogo.png',
    tileSize: { x: 640, y: 480 },
    tiles: { x: 1, y: 1 },
  };
  private playerTexture: Spritesheet = {
    img: new Image(),
    imgPath: 'assets/game/runner-sheet.png',
    tileSize: { x: 32, y: 32 },
    tiles: { x: 8, y: 3 },
  };
  private textures: Spritesheet[] = [this.playerTexture, this.bgTexture];

  //TODO Node Component
  //TODO Jump und Stand

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
    if (event.code === 'Space') {
      this.processing.next(!this.processing.value);
    } else if (event.code === 'Enter') {
      //this.onReloadDots();
    }
  }

  private loadRecources(): void {
    for (const tex of this.textures) {
      tex.img.src = tex.imgPath;
    }
  }

  public ngAfterViewInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.subs.push(this.processing.subscribe(() => this.ngZone.runOutsideAngular(() => this.process(0))));
    this.subs.push(
      this.fpsService.$fps.subscribe((fps) => {
        this.gamestatus.fps = fps;
        this.detector.markForCheck();
      })
    );
  }

  private process(timestamp: number): void {
    if (!this.processing.value || !this.canvas || !this.ctx) {
      return;
    }
    this.fpsService.calcFPS(timestamp);
    if (this.gamestatus.tick++ > 640) {
      this.gamestatus.tick = -32;
    }

    if (this.gamestatus.tick % 8 === 0) {
      this.frame++;
    }

    if (this.frame >= 8) {
      this.frame = 0;
    }
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    this.ctx.drawImage(
      this.bgTexture.img,
      0,
      0,
      this.bgTexture.tileSize.x,
      this.bgTexture.tileSize.y,
      80,
      0,
      this.bgTexture.tileSize.x * 0.5,
      this.bgTexture.tileSize.y * 0.5
    );
    this.ctx.drawImage(
      this.playerTexture.img,
      this.frame * this.playerTexture.tileSize.x,
      this.playerTexture.tileSize.y,
      this.playerTexture.tileSize.x,
      this.playerTexture.tileSize.y,
      this.gamestatus.tick, //player.pos.x
      200, //player.pos.x
      this.playerTexture.tileSize.x,
      this.playerTexture.tileSize.y
    );
    this.ctx.strokeStyle = 'white';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 232);
    this.ctx.lineTo(640, 232);
    this.ctx.stroke();
    requestAnimationFrame((timestamp) => this.process(timestamp));
  }
}
