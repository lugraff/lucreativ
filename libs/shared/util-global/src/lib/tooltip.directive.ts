import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { GlobalUISettingsService } from '@shared/util-settings';
import { TooltipService } from './tooltip.service';

@Directive({
  selector: '[globalTooltip]',
  standalone: true,
})
export class TooltipDirective {
  @Input() public globalTooltip = '';
  @Input() public ttIcon = '';
  @Input() public ttPosition = 'top'; //'top', 'left', 'right', 'bottom'
  @Input() public ttAlign = 'center'; //'start', 'center', 'end'
  @Input() public ttAnchor = 'parent'; //'mouse', 'parent', 'screen'
  @Input() public ttOffset = 8;
  private delayTimeout = setTimeout(() => {
    console.log;
  }, 100);
  private delayHideTimeout = setTimeout(() => {
    console.log;
  }, 100);
  private lastMouseEvent = new MouseEvent('');
  private keyboardEventRef: (ev: KeyboardEvent) => unknown = (event: KeyboardEvent) => this.OnKeyDownEvent(event);
  private mouseDownEventRef: () => unknown = () => this.OnMouseDownEvent();
  private mouseLeaveEventRef: () => unknown = () => this.OnMouseLeaveEvent();

  constructor(
    private elRef: ElementRef,
    public tooltipService: TooltipService,
    private globalUISettings: GlobalUISettingsService
  ) {}

  @HostListener('mouseenter', ['$event']) onMouseEnter(mouseEvent: MouseEvent): void {
    if (!this.globalUISettings.ShowTooltips || this.globalTooltip === undefined) {
      return;
    }
    this.lastMouseEvent = mouseEvent;
    addEventListener('mousedown', this.mouseDownEventRef);
    this.elRef.nativeElement.addEventListener('mouseleave', this.mouseLeaveEventRef);
    if (!this.globalUISettings.TooltipKeyControl || mouseEvent.ctrlKey) {
      removeEventListener('keydown', this.keyboardEventRef);
      this.CreateTooltip();
    } else {
      addEventListener('keydown', this.keyboardEventRef);
    }
  }

  private CreateTooltip(): void {
    clearTimeout(this.delayTimeout);
    clearTimeout(this.delayHideTimeout);
    this.delayTimeout = setTimeout(() => {
      this.tooltipService.ShowTooltip(this.elRef, {
        align: this.ttAlign,
        anchor: this.ttAnchor,
        position: this.ttPosition,
        offset: this.ttOffset,
        text: this.globalTooltip,
        icon: this.ttIcon,
        mouseEvent: this.lastMouseEvent,
      });
    }, this.GetTooltipDelay());
  }

  private OnKeyDownEvent(event: KeyboardEvent): void {
    if (event.key === 'Control' || event.ctrlKey) {
      removeEventListener('keydown', this.keyboardEventRef);
      this.CreateTooltip();
    }
  }

  private OnMouseDownEvent(): void {
    removeEventListener('keydown', this.keyboardEventRef);
    removeEventListener('mousedown', this.mouseDownEventRef);
    this.elRef.nativeElement.removeEventListener('mouseleave', this.mouseLeaveEventRef);
    clearTimeout(this.delayTimeout);
    this.tooltipService.HideTooltip();
  }

  private OnMouseLeaveEvent(): void {
    removeEventListener('keydown', this.keyboardEventRef);
    removeEventListener('mousedown', this.mouseDownEventRef);
    this.elRef.nativeElement.removeEventListener('mouseleave', this.mouseLeaveEventRef);
    clearTimeout(this.delayTimeout);
    clearTimeout(this.delayHideTimeout);
    this.delayHideTimeout = setTimeout(() => {
      this.tooltipService.HideTooltip();
    }, this.GetTooltipDelay() * 0.5);
  }

  private GetTooltipDelay(): number {
    if (this.globalUISettings.TooltipKeyControl) {
      return 2;
    } else {
      if (this.globalUISettings.TooltipDelay < 2) {
        return 2;
      } else {
        return this.globalUISettings.TooltipDelay;
      }
    }
  }
}
