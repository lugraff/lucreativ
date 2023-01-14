import { Component, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipService, TooltipSettings } from '@shared/util-global';
import { GlobalUISettingsService } from '@shared/util-settings';
import { Subscription } from 'rxjs';
import { StandardIconsComponent } from '../standard-icons/standard-icons.component';

export interface Position {
  x: number;
  y: number;
}

@Component({
  selector: 'global-tooltip',
  standalone: true,
  imports: [CommonModule, StandardIconsComponent],
  templateUrl: './tooltip.component.html',
})
export class TooltipComponent implements OnDestroy {
  private subs: Subscription[] = [];
  public text = '';
  public icon = '';
  public arrowDirection = '';
  public arrowOffset = 0;
  public visible = false;

  constructor(public tooltipService: TooltipService, public globalUISettings: GlobalUISettingsService) {
    this.subs.push(tooltipService.showEvent$.subscribe((data) => this.onNewPos(...data)));
    this.subs.push(tooltipService.hideEvent$.subscribe(() => (this.visible = false)));
  }

  private onNewPos(parent: ElementRef, settings: TooltipSettings): void {
    this.visible = false;
    if (settings.anchor === 'parent') {
      this.arrowDirection = settings.position;
      this.arrowOffset = settings.offset;
    } else {
      this.arrowDirection = '';
      this.arrowOffset = 0;
    }
    this.text = settings.text;
    this.icon = settings.icon;
    setTimeout(() => {
      const toolTipWindow = document.getElementById('toolTipWindow') as HTMLDivElement;
      toolTipWindow.style.left = '0px';
      toolTipWindow.style.top = '0px';
      const rectTooltip = toolTipWindow.getBoundingClientRect();
      const rectParent = parent.nativeElement.getBoundingClientRect();
      let position: Position = { x: 0, y: 0 };
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
      toolTipWindow.style.left = position.x + 'px';
      toolTipWindow.style.top = position.y + 'px';
      this.visible = true;
    }, 1);
  }

  private calcMousePos(
    position: string,
    align: string,
    offset: number,
    rectTooltip: DOMRect,
    mouseEvent: MouseEvent
  ): Position {
    let newPosition: Position = { x: 0, y: 0 };
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
  ): Position {
    let newPosition: Position = { x: 0, y: 0 };
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

  private calcScreenPos(position: string, align: string, offset: number, rectTooltip: DOMRect): Position {
    let newPosition: Position = { x: 0, y: 0 };
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
        x: window.innerWidth - offset,
        y: window.innerHeight * alignValue - rectTooltip.height * alignValue,
      };
    } else {
      newPosition = {
        x: window.innerWidth * alignValue - rectTooltip.width * alignValue,
        y: window.innerHeight - rectTooltip.height,
      };
    }
    return newPosition;
  }

  private trimIntoView(newPosition: Position, rectTooltip: DOMRect): Position {
    if (newPosition.y < 0) {
      newPosition.y = 0;
    }
    if (newPosition.x < 0) {
      newPosition.x = 0;
    }
    if (newPosition.y + rectTooltip.height > window.innerHeight) {
      newPosition.y = window.innerHeight - rectTooltip.height;
    }
    if (newPosition.x + rectTooltip.width > window.innerWidth) {
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
