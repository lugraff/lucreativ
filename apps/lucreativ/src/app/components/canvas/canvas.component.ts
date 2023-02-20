import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsMobileScreenService } from '@shared/util-screen';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FPSService } from '@shared/util-global';

interface Gamestatus {
  fps: number;
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
  public gamestatus: Gamestatus = { fps: 0 };

  constructor(
    private ngZone: NgZone,
    private detector: ChangeDetectorRef,
    public screenService: IsMobileScreenService,
    public fpsService: FPSService
  ) {}

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
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeRect(10, 10, 100, 100);
    requestAnimationFrame((timestamp) => this.process(timestamp));
  }
}
