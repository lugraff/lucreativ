import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { GlobalUISettingsService } from '@shared/util-settings';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeWithDays } from '@shared/util-global';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'global-time-panel',
  templateUrl: './time-panel.component.html',
})
export class TimePanelComponent implements OnInit {
  @Output() private deleteItemEvent = new EventEmitter<number>();
  @Input() public entryIndex = 0;
  @Input() public data: TimeWithDays = { time: '00:00', days: [] };
  @Input() public disabled = false;
  public days: string[] = ['M', 'D', 'M', 'D', 'F', 'S', 'S'];
  public everyDay = false;
  public destroyAnimation = false;

  constructor(public uiSettings: GlobalUISettingsService) {}

  public ngOnInit(): void {
    this.lookIfAllDaysChecked();
  }

  public onSomeDayClicked(dayNumber: number): void {
    this.data.days[dayNumber] = !this.data.days[dayNumber];
    this.lookIfAllDaysChecked();
  }

  public onEveryDayClicked(): void {
    this.everyDay = !this.everyDay;
    for (let index = 0; index < this.data.days.length; index++) {
      this.data.days[index] = this.everyDay;
    }
  }

  private lookIfAllDaysChecked(): void {
    for (const day of this.data.days) {
      if (day === false) {
        this.everyDay = false;
        return;
      }
    }
    this.everyDay = true;
  }

  public onDeleteEntry(): void {
    if (this.uiSettings.AnimationType === '') {
      this.deleteItemEvent.emit(this.entryIndex);
    } else {
      this.destroyAnimation = true;
      setTimeout(() => this.deleteItemEvent.emit(this.entryIndex), 200);
    }
  }
}
