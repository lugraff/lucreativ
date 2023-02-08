import { Component, ElementRef, HostBinding, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipService, TooltipSettings, Vector2 } from '@shared/util-global';
import { GlobalUISettingsService } from '@shared/util-settings';
import { Subscription } from 'rxjs';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'global-tooltip',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './tooltip.component.html',
})
export class TooltipComponent implements OnDestroy {
  private subs: Subscription[] = [];
  public text = '';
  public icon = '';
  public iconStroke: string | number | undefined = 1.5;
  public iconSize = '1.5rem';
  public iconColor = '';
  public arrowDirection = '';
  public arrowOffset = 0;
  public arrowOffsetX = 0;
  public arrowOffsetY = 0;
  public visible = false;
  @HostBinding('class') public class = 'fixed z-50 pointer-events-none top-0 left-0';

  constructor(
    public tooltipService: TooltipService,
    public globalUISettings: GlobalUISettingsService,
    private elRef: ElementRef
  ) {
    this.subs.push(tooltipService.showEvent$.subscribe((data) => this.onNewPos(...data)));
    this.subs.push(
      tooltipService.hideEvent$.subscribe(() => {
        this.visible = false;
        this.text = '';
      })
    );
  }

  private onNewPos(parent: ElementRef, settings: TooltipSettings): void {
    this.visible = false;
    this.arrowOffsetX = 0;
    this.arrowOffsetY = 0;
    if (settings.anchor === 'parent' || settings.anchor === '') {
      this.arrowDirection = settings.position;
      this.arrowOffset = settings.offset;
    } else {
      this.arrowDirection = '';
      this.arrowOffset = 0;
    }
    this.text = settings.text;
    this.icon = settings.icon;
    this.iconStroke = settings.iconStroke;
    this.iconSize = settings.ttIconSize;
    this.iconColor = settings.ttIconColor;
    setTimeout(() => {
      this.elRef.nativeElement.style.left = '0px';
      this.elRef.nativeElement.style.top = '0px';
      const rectTooltip = this.elRef.nativeElement.getBoundingClientRect();
      const rectParent = parent.nativeElement.getBoundingClientRect();
      let position: Vector2 = { x: 0, y: 0 };
      if (settings.anchor === 'mouse') {
        position = this.calcMousePos(
          settings.position,
          settings.align,
          settings.offset,
          rectTooltip,
          settings.mouseEvent
        );
      } else if (settings.anchor === 'screen') {
        position = this.calcScreenPos(settings.position, settings.align, settings.offset, rectTooltip);
      } else {
        position = this.calcParentPos(rectParent, settings.position, settings.align, settings.offset, rectTooltip);
      }
      position = this.trimIntoView(position, rectTooltip);
      this.elRef.nativeElement.style.left = position.x + 'px';
      this.elRef.nativeElement.style.top = position.y + 'px';
      this.visible = true;
    }, 0);
  }

  private calcMousePos(
    position: string,
    align: string,
    offset: number,
    rectTooltip: DOMRect,
    mouseEvent: MouseEvent
  ): Vector2 {
    let newPosition: Vector2 = { x: 0, y: 0 };
    let alignValue = 0.5;
    if (align === 'start') {
      alignValue = 0;
    } else if (align === 'end') {
      alignValue = 1;
    }
    if (position === 'top') {
      newPosition = {
        x: mouseEvent.clientX - rectTooltip.width * alignValue,
        y: mouseEvent.clientY - rectTooltip.height - offset,
      };
    } else if (position === 'left') {
      newPosition = {
        x: mouseEvent.clientX - rectTooltip.width - offset,
        y: mouseEvent.clientY - rectTooltip.height * alignValue,
      };
    } else if (position === 'right') {
      newPosition = {
        x: mouseEvent.clientX + offset,
        y: mouseEvent.clientY - rectTooltip.height * alignValue,
      };
    } else {
      newPosition = {
        x: mouseEvent.clientX - rectTooltip.width * alignValue,
        y: mouseEvent.clientY + offset,
      };
    }
    return newPosition;
  }

  private calcParentPos(
    rectParent: DOMRect,
    position: string,
    align: string,
    offset: number,
    rectTooltip: DOMRect
  ): Vector2 {
    let newPosition: Vector2 = { x: 0, y: 0 };
    let alignValue = 0.5;
    if (align === 'start') {
      alignValue = 0;
    } else if (align === 'end') {
      alignValue = 1;
    }
    if (position === 'top') {
      newPosition = {
        x: rectParent.x + rectParent.width * alignValue - rectTooltip.width * alignValue,
        y: rectParent.top - rectTooltip.height - offset * 0.1,
      };
      if (newPosition.y < 0) {
        this.arrowDirection = 'bottom';
        newPosition.y = rectParent.bottom + offset * 0.1;
      }
    } else if (position === 'left') {
      newPosition = {
        x: rectParent.left - rectTooltip.width - offset * 0.1,
        y: rectParent.y + rectParent.height * alignValue - rectTooltip.height * alignValue,
      };
      if (newPosition.x < 0) {
        this.arrowDirection = 'right';
        newPosition.x = rectParent.right + offset * 0.1;
      }
    } else if (position === 'right') {
      newPosition = {
        x: rectParent.right + offset * 0.1,
        y: rectParent.y + rectParent.height * alignValue - rectTooltip.height * alignValue,
      };
      if (newPosition.x + rectTooltip.width > window.innerWidth) {
        this.arrowDirection = 'left';
        newPosition.x = rectParent.left - rectTooltip.width - offset * 0.1;
      }
    } else {
      newPosition = {
        x: rectParent.x + rectParent.width * alignValue - rectTooltip.width * alignValue,
        y: rectParent.bottom + offset * 0.1,
      };
      if (newPosition.y + rectTooltip.height > window.innerHeight) {
        this.arrowDirection = 'top';
        newPosition.y = rectParent.top - rectTooltip.height - offset * 0.1;
      }
    }
    return newPosition;
  }

  private calcScreenPos(position: string, align: string, offset: number, rectTooltip: DOMRect): Vector2 {
    let newPosition: Vector2 = { x: 0, y: 0 };
    let alignValue = 0.5;
    if (align === 'start') {
      alignValue = 0;
    } else if (align === 'end') {
      alignValue = 1;
    }
    if (position === 'top') {
      newPosition = {
        x: window.innerWidth * alignValue - rectTooltip.width * alignValue,
        y: offset,
      };
    } else if (position === 'left') {
      newPosition = {
        x: offset,
        y: window.innerHeight * alignValue - rectTooltip.height * alignValue,
      };
    } else if (position === 'right') {
      newPosition = {
        x: window.innerWidth - rectTooltip.width - offset,
        y: window.innerHeight * alignValue - rectTooltip.height * alignValue,
      };
    } else {
      newPosition = {
        x: window.innerWidth * alignValue - rectTooltip.width * alignValue,
        y: window.innerHeight - rectTooltip.height - offset,
      };
    }
    return newPosition;
  }

  private trimIntoView(newPosition: Vector2, rectTooltip: DOMRect): Vector2 {
    if (newPosition.y < 0) {
      this.arrowOffsetY = newPosition.y;
      newPosition.y = 0;
    }
    if (newPosition.x < 0) {
      this.arrowOffsetX = newPosition.x;
      newPosition.x = 0;
    }
    if (newPosition.y + rectTooltip.height > window.innerHeight) {
      this.arrowOffsetY = newPosition.y + rectTooltip.height - window.innerHeight;
      newPosition.y = window.innerHeight - rectTooltip.height;
    }
    if (newPosition.x + rectTooltip.width > window.innerWidth) {
      this.arrowOffsetX = newPosition.x + rectTooltip.width - window.innerWidth;
      newPosition.x = window.innerWidth - rectTooltip.width;
    }
    return newPosition;
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
