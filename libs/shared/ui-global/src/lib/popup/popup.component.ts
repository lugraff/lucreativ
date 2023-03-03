import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { MouseEventService } from '@shared/util-global';
import { IsMobileScreenService } from '@shared/util-screen';
import { GlobalUISettingsService } from '@shared/util-settings';
import { Subscription, take } from 'rxjs';
import { IconComponent } from '../icon/icon.component';

//TODO Aktiv Window rework ( active wenn mouseEnter | deactive wenn outside click?)
//TODO Window Dock
//TODO Minimize side by side

@Component({
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
  selector: 'global-popup',
  templateUrl: './popup.component.html',
})
export class PopupComponent implements AfterViewInit, OnDestroy {
  @ViewChild('popup') private popupElementRef: ElementRef = new ElementRef(HTMLDivElement);
  @Input() public myTitle = '';
  @Input() public closeable = true;
  @Input() public resizeable = false;
  @Input() public minimizeable = true;
  @Input() public backCovered = true;
  @Input() public popupWidth = 'auto';
  @Input() public popupHeight = 'auto';
  @Input() public anchor = 'screen'; // 'mouse'
  @Input() public position = 'center'; // 'center' 'top' 'bottom' 'left' 'right' 'top-left' 'top-right' 'bottom-left' 'bottom-right'
  @Input() public offset = 16;
  @Input() public icon = '';
  @Input() public iconStroke: string | number | undefined = 1.5;
  @Input() public iconSize = '1.5rem';
  @Input() public iconColor = '';
  @Output() public whenClosing = new EventEmitter();
  public dragWindow = false;
  public resizeWindow = false;
  public activeWindow = false;
  public status = '';
  public iconColors = ['tertiary', 'tertiary', 'tertiary', 'tertiary'];
  private popup = document.createElement('div') as HTMLDivElement;
  private subscriptionsForMouseEvents: Subscription[] = [];
  private subscriptionsForWindowSize: Subscription[] = [];
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private savedWidth = '';
  private savedHeight = '';
  private keyboardEventRef: (ev: KeyboardEvent) => unknown = (event: KeyboardEvent) => this.OnKeyDownEvent(event);

  // @HostListener('window:mouseup', ['$event']) clickedOut(event: PointerEvent) {
  //   //TODO nur wenn Popup da ist!
  //   const popupRect = this.popup.getBoundingClientRect();
  //   if (
  //     event.clientX < popupRect.right &&
  //     event.clientX > popupRect.left &&
  //     event.clientY > popupRect.top &&
  //     event.clientY < popupRect.bottom
  //   ) {
  //     this.activeWindow = true;
  //   } else {
  //     this.activeWindow = false;
  //   }
  // }

  constructor(
    private mouseEvents: MouseEventService,
    public globalUISettings: GlobalUISettingsService,
    private screenService: IsMobileScreenService,
    private detector: ChangeDetectorRef
  ) {}

  private OnKeyDownEvent(event: KeyboardEvent): void {
    if (this.activeWindow) {
      if (this.closeable && event.key === 'Escape') {
        this.onClose();
      }
    }
  }

  public ngAfterViewInit(): void {
    addEventListener('keydown', this.keyboardEventRef); //oder erst wenn activeWindow true ist?
    this.popup = this.popupElementRef.nativeElement;
    this.popup.style.width = this.popupWidth;
    this.popup.style.height = this.popupHeight;

    if (this.anchor === 'screen') {
      this.appearAtScreen();
    } else {
      this.appearAtMouse();
    }

    new ResizeObserver(() => {
      this.moveIntoViewX();
      this.moveIntoViewY();
    }).observe(this.popup);

    this.subscriptionsForWindowSize.push(this.screenService.windowWidth$.subscribe(() => this.moveIntoViewX()));
    this.subscriptionsForWindowSize.push(this.screenService.windowHeight$.subscribe(() => this.moveIntoViewY()));

    this.savedWidth = this.popup.style.width;
    this.savedHeight = this.popup.style.height;
  }

  private appearAtScreen(position: string = this.position): void {
    let appearYOffset = 0;
    let appearXOffset = 0;
    const multibler = 0.5;
    if (position === 'top') {
      appearYOffset = this.offset;
      appearXOffset = window.innerWidth * multibler - this.popup.clientWidth * multibler;
    } else if (position === 'bottom') {
      appearYOffset = window.innerHeight - this.popup.clientHeight - this.offset;
      appearXOffset = window.innerWidth * multibler - this.popup.clientWidth * multibler;
    } else if (position === 'left') {
      appearYOffset = window.innerHeight * multibler - this.popup.clientHeight * multibler;
      appearXOffset = this.offset;
    } else if (position === 'right') {
      appearYOffset = window.innerHeight * multibler - this.popup.clientHeight * multibler;
      appearXOffset = window.innerWidth - this.popup.clientWidth - this.offset;
    } else if (position === 'top-left') {
      appearYOffset = this.offset;
      appearXOffset = this.offset;
    } else if (position === 'top-right') {
      appearYOffset = this.offset;
      appearXOffset = window.innerWidth - this.popup.clientWidth - this.offset;
    } else if (position === 'bottom-left') {
      appearYOffset = window.innerHeight - this.popup.clientHeight - this.offset;
      appearXOffset = this.offset;
    } else if (position === 'bottom-right') {
      appearYOffset = window.innerHeight - this.popup.clientHeight - this.offset;
      appearXOffset = window.innerWidth - this.popup.clientWidth - this.offset;
    } else {
      appearYOffset = window.innerHeight * multibler - this.popup.clientHeight * multibler;
      appearXOffset = window.innerWidth * multibler - this.popup.clientWidth * multibler;
    }
    this.popup.style.top = appearYOffset.toString() + 'px';
    this.popup.style.left = appearXOffset.toString() + 'px';
  }

  private appearAtMouse(position: string = this.position): void {
    this.mouseEvents.mouseLastEvent.pipe(take(1)).subscribe((event) => {
      if (event !== undefined) {
        let appearYOffset = 0;
        let appearXOffset = 0;
        const multibler = 0.5;
        if (position === 'top') {
          appearYOffset = -this.popup.clientHeight - this.offset;
          appearXOffset = -this.popup.clientWidth * multibler;
        } else if (position === 'bottom') {
          appearYOffset = this.offset;
          appearXOffset = -this.popup.clientWidth * multibler;
        } else if (position === 'left') {
          appearYOffset = -this.popup.clientHeight * multibler;
          appearXOffset = -this.popup.clientWidth - this.offset;
        } else if (position === 'right') {
          appearYOffset = -this.popup.clientHeight * multibler;
          appearXOffset = this.offset;
        } else if (position === 'top-left') {
          appearYOffset = -this.popup.clientHeight - this.offset;
          appearXOffset = -this.popup.clientWidth - this.offset;
        } else if (position === 'top-right') {
          appearYOffset = -this.popup.clientHeight - this.offset;
          appearXOffset = this.offset;
        } else if (position === 'bottom-left') {
          appearYOffset = this.offset;
          appearXOffset = -this.popup.clientWidth - this.offset;
        } else if (position === 'bottom-right') {
          appearYOffset = this.offset;
          appearXOffset = this.offset;
        } else {
          appearYOffset = -this.popup.clientHeight * multibler;
          appearXOffset = -this.popup.clientWidth * multibler;
        }
        this.popup.style.top = (event.clientY + appearYOffset).toString() + 'px';
        this.popup.style.left = (event.clientX + appearXOffset).toString() + 'px';
      }
    });
  }

  public onStartMove(event: MouseEvent | undefined): void {
    
    if (event !== undefined) {
      this.dragWindow = true;
      window.getSelection()?.removeAllRanges();
      this.subscriptionsForMouseEvents.push(
        this.mouseEvents.mouseMove.subscribe((event) => {
          this.onMove(event);
        })
      );
      this.subscriptionsForMouseEvents.push(this.mouseEvents.mouseUp.subscribe(() => this.onEnd()));
      this.dragOffsetX = event.offsetX;
      this.dragOffsetY = event.offsetY;
    }
  }

  public onMove(event: MouseEvent | undefined): void {
    if (!this.dragWindow || event === undefined) {
      return;
    }
    this.popup.style.left = this.WithinX(event.clientX - this.dragOffsetX, this.popup.clientWidth).toString() + 'px';
    this.popup.style.top = this.WithinY(event.clientY - this.dragOffsetY, this.popup.clientHeight).toString() + 'px';
  }

  public onStartResize(event: MouseEvent | undefined): void {
    if (event !== undefined) {
      window.getSelection()?.removeAllRanges();
      this.resizeWindow = true;
      this.subscriptionsForMouseEvents.push(this.mouseEvents.mouseMove.subscribe((event) => this.onResize(event)));
      this.subscriptionsForMouseEvents.push(this.mouseEvents.mouseUp.subscribe(() => this.onEnd()));
    }
  }

  public onResize(event: MouseEvent | undefined): void {
    if (!this.resizeWindow || event === undefined) {
      return;
    }
    this.popup.style.width = event.clientX - this.popup.getBoundingClientRect().x + 'px';
    this.popup.style.height = event.clientY - this.popup.getBoundingClientRect().y + 'px';
  }

  public onEnd(): void {
    window.getSelection()?.removeAllRanges();
    this.dragWindow = false;
    this.resizeWindow = false;
    this.unsubMouseEvents();
    this.checkStatus();
    this.detector.markForCheck();
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
    this.popup.style.width = '100%';
    this.popup.style.height = '100%';
    this.checkStatus();
  }

  public onWindowed(): void {
    this.popup.style.width = this.savedWidth;
    this.popup.style.height = this.savedHeight;
    this.checkStatus();
    this.appearAtScreen('center');
  }

  public onMinimize(): void {
    this.popup.style.width = '8rem';
    this.popup.style.height = '2rem';
    this.popup.style.left = '100%';
    this.popup.style.top = '100%';
    this.checkStatus();
  }

  private checkStatus(): void {
    this.iconColors = ['tertiary', 'tertiary', 'tertiary', 'tertiary'];
    if (this.popup.clientHeight <= 36) {
      this.status = 'minimized';
    } else if (this.popup.clientHeight > 36 && this.popup.clientHeight < window.innerHeight - 20) {
      this.status = '';
    } else if (this.popup.clientHeight >= window.innerHeight - 20) {
      this.status = 'maximized';
    }
  }

  public onClose(): void {
    this.whenClosing.emit();
    removeEventListener('keydown', this.keyboardEventRef); //oder schon wenn activeWindow false ist?
  }

  private moveIntoViewX(): void {
    this.popup.style.left = this.WithinX(this.popup.offsetLeft, this.popup.clientWidth).toString() + 'px';
  }

  private moveIntoViewY(): void {
    this.popup.style.top = this.WithinY(this.popup.offsetTop, this.popup.clientHeight).toString() + 'px';
  }

  private WithinX(popupPositionX: number, popupWidth: number): number {
    if (popupPositionX < 0) {
      popupPositionX = 0;
    } else if (popupPositionX > window.innerWidth - popupWidth) {
      popupPositionX = window.innerWidth - popupWidth;
    }
    return popupPositionX;
  }
  private WithinY(popupPositionY: number, popupHeight: number): number {
    if (popupPositionY < 0) {
      popupPositionY = 0;
    } else if (popupPositionY > window.innerHeight - popupHeight) {
      popupPositionY = window.innerHeight - popupHeight;
    }
    return popupPositionY;
  }
}
