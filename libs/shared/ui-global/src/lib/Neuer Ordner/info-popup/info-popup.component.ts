import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { Vector2 } from '@shared/util-global';
import { GlobalUISettingsService } from '@shared/util-settings';
import { ButtonStandardComponent } from '../button-standard/button-standard.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonStandardComponent],
  selector: 'global-info-popup',
  templateUrl: './info-popup.component.html',
})
export class InfoPopupComponent implements OnChanges {
  @Input() public infoText = '';
  @Output() public infoTextChange = new EventEmitter();
  @Input() public infoTimeout = 0;
  @Input() public infoPosition = 'right'; //'top', 'left', 'right', 'bottom'
  @Input() public infoAlign = 'end'; //'start', 'center', 'end'
  @Input() public infoOffset = 64; //TODO Offset auf Align rechnen? Dann wäre bottom end default
  @Input() public showOK = false;

  @Input() public icon = '';
  @Input() public iconStroke: string | number | undefined = 1.5;
  @Input() public iconSize = '1.5rem';
  @Input() public iconColor = '';

  @HostBinding('class') public class = 'fixed z-50';
  // @Input() public infoAnchor = 'screen'; //'screen', 'mouse'

  private hideTimeout = setTimeout(() => {
    console.log;
  }, 100);

  constructor(public globalUISettings: GlobalUISettingsService, private elRef: ElementRef) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const changeText: SimpleChange = changes['infoText'];
    if (changeText) {
      this.SetPosition();
      clearTimeout(this.hideTimeout);
      this.hideTimeout = setTimeout(() => {
        this.ResetInfoPopup();
      }, this.calcDisplayTime());
    }
  }

  private calcDisplayTime(): number {
    let displayTimeout = this.infoTimeout;
    if (displayTimeout <= 0) {
      displayTimeout = this.infoText.length * 33;
      if (displayTimeout < 2000) {
        displayTimeout = 2000;
      }
    }
    return displayTimeout;
  }

  public OnClose(): void {
    clearTimeout(this.hideTimeout);
    this.ResetInfoPopup();
  }

  private ResetInfoPopup(): void {
    this.infoText = '';
    this.infoTextChange.next(this.infoText);
  }

  private SetPosition(): void {
    this.elRef.nativeElement.style.left = '0px';
    this.elRef.nativeElement.style.top = '0px';
    setTimeout(() => {
      let position: Vector2 = { x: 0, y: 0 };
      position = this.calcScreenPos(
        this.infoPosition,
        this.infoAlign,
        this.infoOffset,
        this.elRef.nativeElement.getBoundingClientRect()
      );
      this.elRef.nativeElement.style.left = position.x + 'px';
      this.elRef.nativeElement.style.top = position.y + 'px';
    }, 0);
  }

  private calcScreenPos(position: string, align: string, offset: number, rectInfoPopup: DOMRect): Vector2 {
    let newPosition: Vector2 = { x: 0, y: 0 };
    let alignValue = 0.5;
    if (align === 'start') {
      alignValue = 0;
    } else if (align === 'end') {
      alignValue = 1;
    }
    if (position === 'top') {
      newPosition = {
        x: window.innerWidth * alignValue - rectInfoPopup.width * alignValue,
        y: offset,
      };
    } else if (position === 'left') {
      newPosition = {
        x: offset,
        y: window.innerHeight * alignValue - rectInfoPopup.height * alignValue,
      };
    } else if (position === 'right') {
      newPosition = {
        x: window.innerWidth - rectInfoPopup.width - offset,
        y: window.innerHeight * alignValue - rectInfoPopup.height * alignValue,
      };
    } else if (position === 'bottom') {
      newPosition = {
        x: window.innerWidth * alignValue - rectInfoPopup.width * alignValue,
        y: window.innerHeight - rectInfoPopup.height - offset,
      };
    } else {
      newPosition = {
        x: window.innerWidth * 0.5 - rectInfoPopup.width * 0.5,
        y: window.innerHeight * 0.5 - rectInfoPopup.height * 0.5,
      };
    }
    return newPosition;
  }
}
