import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalUISettingsService } from '@shared/util-settings';
import { TimeWithDays } from '@shared/util-global';
import { ButtonStandardComponent } from '../button-standard/button-standard.component';
import { TimePanelComponent } from './time-panel.component';

@Component({
  standalone: true,
  imports: [CommonModule, ButtonStandardComponent, TimePanelComponent],
  // providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimePanelListComponent), multi: true }],
  selector: 'global-time-panel-list',
  templateUrl: './time-panel-list.component.html',
})
export class TimePanelListComponent {
  @Input() timeWithDaysList: TimeWithDays[] = [];
  public disabled = false;
  // public backuptimeList: Backuptime[] = [];

  constructor(public uiSettings: GlobalUISettingsService) {}

  public onNewBackupTimer(): void {
    this.timeWithDaysList.push({
      time: '00:00',
      days: [false, false, false, false, false, false, false],
    });
  }

  public deleteItemEvent($event: number): void {
    this.timeWithDaysList.splice($event, 1);
  }
}
