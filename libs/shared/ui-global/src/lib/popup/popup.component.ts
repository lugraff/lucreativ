import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { MouseEventService } from '@shared/util-global';
import { IsMobileScreenService } from '@shared/util-screen';
import { GlobalUISettingsService } from '@shared/util-settings';
import { Subscription, take } from 'rxjs';
import { IconComponent } from '../icon/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent],
  selector: 'global-popup',
  templateUrl: './popup.component.html',
})
export class PopupComponent implements AfterViewInit, OnDestroy {
  public elementId = 'ID' + Math.floor(Math.random() * 10000000).toString();
  @Input() public myTitle = '';
  @Input() public closeable = true;
  @Input() public resizeable = false;
  @Input() public minimizeable = true;
  @Input() public backCovered = true;
  @Input() public popupWidth = '25%';
  @Input() public appearX = '50%';
  @Input() public appearY = '50%';
  @Input() public appearMouse = '';
  @Input() public icon = '';
  @Input() public iconStroke: string | number | undefined = undefined;
  @Input() public iconSize = '1.5rem';
  @Input() public iconColor = '';
  @Output() public whenClosing = new EventEmitter();
  public dragWindow = false;
  public resizeWindow = false;
  public activeWindow = false;
  public status = '';
  private self: HTMLElement | null = null;
  private subscriptionsForMouseEvents: Subscription[] = [];
  private subscriptionsForWindowSize: Subscription[] = [];
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private savedWidth = '';
  private savedHeight = '';
  private mouseAppearLocations = [
    'center',
    'top',
    'bottom',
    'left',
    'right',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ];

  @HostListener('window:keydown.Escape', ['$event'])
  keyEvent(): void {
    if (this.closeable) {
      this.onClose();
    }
  }

  constructor(
    private mouseEvents: MouseEventService,
    public globalUISettings: GlobalUISettingsService,
    private screenService: IsMobileScreenService
  ) {}

  public ngAfterViewInit(): void {
    this.self = document.getElementById(this.elementId);
    if (this.self !== null) {
      this.self.style.width = this.popupWidth;

      if (this.mouseAppearLocations.includes(this.appearMouse)) {
        this.appearAtMouse();
      }

      new ResizeObserver(() => {
        this.moveIntoViewX();
        this.moveIntoViewY();
      }).observe(this.self);

      this.subscriptionsForWindowSize.push(this.screenService.windowWidth$.subscribe(() => this.moveIntoViewX()));
      this.subscriptionsForWindowSize.push(this.screenService.windowHeight$.subscribe(() => this.moveIntoViewY()));

      this.savedWidth = this.self.style.width;
      this.savedHeight = this.self.style.height;
    }
  }

  private appearAtMouse(): void {
    this.mouseEvents.mouseMoveBehave.pipe(take(1)).subscribe((event) => {
      if (event !== undefined) {
        let appearXOffset = 0;
        let appearYOffset = 0;
        const multibler = 1.9;
        if (this.self !== null) {
          if (this.appearMouse === 'top') {
            appearYOffset = -this.self.clientHeight / multibler;
          } else if (this.appearMouse === 'bottom') {
            appearYOffset = this.self.clientHeight / multibler;
          } else if (this.appearMouse === 'left') {
            appearXOffset = -this.self.clientWidth / multibler;
          } else if (this.appearMouse === 'right') {
            appearXOffset = this.self.clientWidth / multibler;
          } else if (this.appearMouse === 'top-left') {
            appearYOffset = -this.self.clientHeight / multibler;
            appearXOffset = -this.self.clientWidth / multibler;
          } else if (this.appearMouse === 'top-right') {
            appearYOffset = -this.self.clientHeight / multibler;
            appearXOffset = this.self.clientWidth / multibler;
          } else if (this.appearMouse === 'bottom-left') {
            appearYOffset = this.self.clientHeight / multibler;
            appearXOffset = -this.self.clientWidth / multibler;
          } else if (this.appearMouse === 'bottom-right') {
            appearYOffset = this.self.clientHeight / multibler;
            appearXOffset = this.self.clientWidth / multibler;
          }
          this.self.style.left = (event.clientX + appearXOffset).toString() + 'px';
          this.self.style.top = (event.clientY + appearYOffset).toString() + 'px';
        }
      }
    });
  }

  public onStartMove(event: MouseEvent | undefined): void {
    if (event !== undefined) {
      this.dragWindow = true;
      this.subscriptionsForMouseEvents.push(this.mouseEvents.mouseMove.subscribe((event) => this.onMove(event)));
      this.subscriptionsForMouseEvents.push(this.mouseEvents.mouseUp.subscribe(() => this.onEnd()));
      if (this.self !== null) {
        this.dragOffsetX = event.offsetX - this.self.clientWidth / 2;
        this.dragOffsetY = event.offsetY - this.self.clientHeight / 2;
      }
    }
  }

  public onMove(event: MouseEvent | undefined): void {
    if (!this.dragWindow || this.elementId === null || event === undefined) {
      return;
    }
    if (this.self !== null) {
      this.self.style.left = this.WithinX(event.clientX - this.dragOffsetX, this.self.clientWidth).toString() + 'px';
      this.self.style.top = this.WithinY(event.clientY - this.dragOffsetY, this.self.clientHeight).toString() + 'px';
    }
  }

  public onStartResize(event: MouseEvent | undefined): void {
    if (event !== undefined) {
      this.resizeWindow = true;
      this.subscriptionsForMouseEvents.push(this.mouseEvents.mouseMove.subscribe((event) => this.onResize(event)));
      this.subscriptionsForMouseEvents.push(this.mouseEvents.mouseUp.subscribe(() => this.onEnd()));
    }
  }

  public onResize(event: MouseEvent | undefined): void {
    if (!this.resizeWindow || this.elementId === null || event === undefined) {
      return;
    }
    if (this.self !== null) {
      this.self.style.width = event.clientX + 16 - this.self.getBoundingClientRect().x + 'px';
      this.self.style.height = event.clientY + 16 - this.self.getBoundingClientRect().y + 'px';
    }
  }

  public onEnd(): void {
    this.dragWindow = false;
    this.resizeWindow = false;
    this.unsubMouseEvents();
    this.checkStatus();
  }

  public ngOnDestroy(): void {
    this.unsubMouseEvents();
    this.subscriptionsForWindowSize.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private unsubMouseEvents(): void {
    this.subscriptionsForMouseEvents.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public onOutsideClick(): void {
    if (this.closeable) {
      this.onClose();
    }
  }

  public onMaximize(): void {
    if (this.self !== null) {
      this.self.style.width = '100%';
      this.self.style.height = '100%';
      this.self.style.left = '50%';
      this.self.style.top = '50%';
    }
    this.checkStatus();
  }

  public onWindowed(): void {
    if (this.self !== null) {
      this.self.style.width = this.savedWidth;
      this.self.style.height = this.savedHeight;
      this.self.style.left = '50%';
      this.self.style.top = '50%';
    }
    this.checkStatus();
  }

  public onMinimize(): void {
    if (this.self !== null) {
      this.self.style.width = '0px';
      this.self.style.height = '0px';
      this.self.style.left = '100%';
      this.self.style.top = '100%';
    }
    this.checkStatus();
  }

  private checkStatus(): void {
    if (this.self !== null) {
      if (this.self.clientHeight <= 36) {
        this.status = 'minimized';
      } else if (this.self.clientHeight > 36 && this.self.clientHeight < window.innerHeight - 20) {
        this.status = '';
      } else if (this.self.clientHeight >= window.innerHeight - 20) {
        this.status = 'maximized';
      }
    }
  }

  public onClose(): void {
    this.whenClosing.emit();
  }

  private moveIntoViewX(): void {
    if (this.self !== null) {
      this.self.style.left = this.WithinX(this.self.offsetLeft, this.self.clientWidth).toString() + 'px';
    }
  }

  private moveIntoViewY(): void {
    if (this.self !== null) {
      this.self.style.top = this.WithinY(this.self.offsetTop, this.self.clientHeight).toString() + 'px';
    }
  }

  private WithinX(popupPositionX: number, popupWidth: number): number {
    if (popupPositionX < popupWidth / 2 + 0) {
      popupPositionX = popupWidth / 2 + 0;
    } else if (popupPositionX > window.innerWidth - popupWidth / 2 - 0) {
      popupPositionX = window.innerWidth - popupWidth / 2 - 0;
    }
    return popupPositionX;
  }
  private WithinY(popupPositionY: number, popupHeight: number): number {
    if (popupPositionY < popupHeight / 2) {
      popupPositionY = popupHeight / 2;
    } else if (popupPositionY > window.innerHeight - popupHeight / 2) {
      popupPositionY = window.innerHeight - popupHeight / 2;
    }
    return popupPositionY;
  }
}
