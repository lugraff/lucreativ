import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { IsMobileScreenService } from '@shared/util-screen';
import { GlobalUISettingsService } from '@shared/util-settings';
import { ButtonStandardComponent } from '../button-standard/button-standard.component';
import { InputCheckboxComponent } from '../input-checkbox/input-checkbox.component';
import { InputStandardComponent } from '../input-standard/input-standard.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';

@Component({
  standalone: true,
  imports: [CommonModule, InputCheckboxComponent, InputStandardComponent, ButtonStandardComponent, TooltipDirective],
  selector: 'global-local-settings',
  templateUrl: './local-settings.component.html',
})
export class LocalSettingsComponent {
  public isMobileScreen = false;
  @Output() public whenResetting = new EventEmitter();

  constructor(public globalsUI: GlobalUISettingsService, screenService: IsMobileScreenService) {
    screenService.isMobileScreen$.subscribe((value) => (this.isMobileScreen = value));
  }

  public ChangeTTDelay($event: string): void {
    let value = Number($event);
    if (value === null) {
      value = 600;
    }
    if (value < 0) {
      value = 0;
    } else if (value > 999) {
      value = 999;
    }
    this.globalsUI.TooltipDelay = value;
  }

  public onResetSettings(): void {
    this.whenResetting.emit();
    this.globalsUI.resetSettings();
  }
}
