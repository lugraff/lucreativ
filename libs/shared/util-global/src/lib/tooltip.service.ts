import { ElementRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TooltipSettings } from './entities/tooltip-settings';

@Injectable({
  providedIn: 'root',
})
export class TooltipService {
  private showEvent = new Subject<[ElementRef, TooltipSettings]>();
  public showEvent$ = this.showEvent.asObservable();
  private hideEvent = new Subject<boolean>();
  public hideEvent$ = this.hideEvent.asObservable();

  public ShowTooltip(elRef: ElementRef, data: TooltipSettings) {
    this.showEvent.next([elRef, data]);
  }

  public HideTooltip(): void {
    this.hideEvent.next(true);
  }
}
