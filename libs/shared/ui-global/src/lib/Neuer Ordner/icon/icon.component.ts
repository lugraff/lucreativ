import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroFingerPrint,
  heroWrenchScrewdriver,
  heroArrowDownOnSquareStack,
  heroArrowDownOnSquare,
} from '@ng-icons/heroicons/outline';
import {
  featherAlertCircle,
  featherAlertTriangle,
  featherArrowDownCircle,
  featherArrowLeftCircle,
  featherArrowRightCircle,
  featherArrowUpCircle,
  featherCalendar,
  featherCheck,
  featherCheckCircle,
  featherChevronDown,
  featherChevronLeft,
  featherChevronRight,
  featherChevronUp,
  featherChevronsDown,
  featherChevronsLeft,
  featherChevronsRight,
  featherChevronsUp,
  featherClock,
  featherCopy,
  featherDatabase,
  featherDelete,
  featherEdit,
  featherFileText,
  featherFilter,
  featherHelpCircle,
  featherImage,
  featherInfo,
  featherKey,
  featherLogIn,
  featherLogOut,
  featherMaximize,
  featherMinimize,
  featherMinus,
  featherMenu,
  featherMinusCircle,
  featherPlusCircle,
  featherMoreHorizontal,
  featherMoreVertical,
  featherMove,
  featherPhone,
  featherPieChart,
  featherPlayCircle,
  featherPlus,
  featherPauseCircle,
  featherPrinter,
  featherRefreshCcw,
  featherSave,
  featherSearch,
  featherServer,
  featherSettings,
  featherSlash,
  featherStopCircle,
  featherToggleLeft,
  featherToggleRight,
  featherTool,
  featherTrash2,
  featherType,
  featherUser,
  featherX,
  featherXCircle,
  featherZoomIn,
  featherZoomOut,
} from '@ng-icons/feather-icons';
import { getTailwindColorHexCode } from '@shared/util-global';
//TODO size & stroke kontrollieren
// INFO: Hier Icons laden! ICONS: https://ng-icons.github.io/ng-icons/#/browse-icons
@Component({
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      featherAlertCircle,
      featherAlertTriangle,
      featherArrowDownCircle,
      featherArrowLeftCircle,
      featherArrowRightCircle,
      featherArrowUpCircle,
      featherCalendar,
      featherCheck,
      featherCheckCircle,
      featherChevronDown,
      featherChevronLeft,
      featherChevronRight,
      featherChevronUp,
      featherChevronsDown,
      featherChevronsLeft,
      featherChevronsRight,
      featherChevronsUp,
      featherClock,
      featherCopy,
      featherDatabase,
      featherDelete,
      featherEdit,
      featherFileText,
      featherFilter,
      featherHelpCircle,
      featherImage,
      featherInfo,
      featherKey,
      featherLogIn,
      featherLogOut,
      featherMaximize,
      featherMinimize,
      featherMinus,
      featherMenu,
      featherMinusCircle,
      featherPlusCircle,
      featherMoreHorizontal,
      featherMoreVertical,
      featherMove,
      featherPhone,
      featherPieChart,
      featherPlayCircle,
      featherPlus,
      featherPauseCircle,
      featherPrinter,
      featherRefreshCcw,
      featherSave,
      featherSearch,
      featherServer,
      featherSettings,
      featherSlash,
      featherStopCircle,
      featherToggleLeft,
      featherToggleRight,
      featherTool,
      featherTrash2,
      featherType,
      featherUser,
      featherX,
      featherXCircle,
      featherZoomIn,
      featherZoomOut,
      heroFingerPrint,
      heroWrenchScrewdriver,
      heroArrowDownOnSquareStack,
      heroArrowDownOnSquare,
    }),
  ],
  selector: 'global-icon',
  template: `<div
    *ngIf="icon !== undefined && icon !== ''"
    class="flex">
    <div *ngIf="icon.startsWith('http'); else ngIcon">
      <img
        [ngStyle]="{ width: size }"
        [src]="icon" />
    </div>
    <ng-template #ngIcon>
      <ng-icon
        *ngIf="_icon !== ''"
        [name]="_icon"
        [strokeWidth]="strokeWidth"
        [size]="size"
        [color]="_color">
      </ng-icon>
    </ng-template>
  </div>`,
})
export class IconComponent implements OnChanges {
  @Input() public icon: string | undefined = undefined;
  public _icon = '';
  @Input() public strokeWidth: string | number | undefined = 1.5;
  @Input() public size = '1.5rem';
  @Input() public color = '';
  public _color = '';
  public readonly icons = [
    'featherAlertCircle',
    'featherAlertTriangle',
    'featherArrowDownCircle',
    'featherArrowLeftCircle',
    'featherArrowRightCircle',
    'featherArrowUpCircle',
    'featherCalendar',
    'featherCheck',
    'featherCheckCircle',
    'featherChevronDown',
    'featherChevronLeft',
    'featherChevronRight',
    'featherChevronUp',
    'featherChevronsDown',
    'featherChevronsLeft',
    'featherChevronsRight',
    'featherChevronsUp',
    'featherClock',
    'featherCopy',
    'featherDatabase',
    'featherDelete',
    'featherEdit',
    'featherFileText',
    'featherFilter',
    'featherHelpCircle',
    'featherImage',
    'featherInfo',
    'featherKey',
    'featherLogIn',
    'featherLogOut',
    'featherMaximize',
    'featherMinimize',
    'featherMinus',
    'featherMenu',
    'featherMinusCircle',
    'featherPlusCircle',
    'featherMoreHorizontal',
    'featherMoreVertical',
    'featherMove',
    'featherPhone',
    'featherPieChart',
    'featherPlayCircle',
    'featherPlus',
    'featherPauseCircle',
    'featherPrinter',
    'featherRefreshCcw',
    'featherSave',
    'featherSearch',
    'featherServer',
    'featherSettings',
    'featherSlash',
    'featherStopCircle',
    'featherToggleLeft',
    'featherToggleRight',
    'featherTool',
    'featherTrash2',
    'featherType',
    'featherUser',
    'featherX',
    'featherXCircle',
    'featherZoomIn',
    'featherZoomOut',
    'heroFingerPrint',
    'heroWrenchScrewdriver',
    'heroArrowDownOnSquareStack',
    'heroArrowDownOnSquare',
  ];

  public ngOnChanges(changes: SimpleChanges): void {
    const changeIcon: SimpleChange = changes['icon'];
    const changeColor: SimpleChange = changes['color'];
    if (changeIcon || changeColor) {
      if (this.icon !== undefined) {
        this._icon = this.iconExists(this.icon);
        this._color = getTailwindColorHexCode(this.color);
      }
    }
  }

  private iconExists(icon: string): string {
    if (this.icons.includes(icon)) {
      return icon;
    }
    this.color = '#646464';
    return 'featherHelpCircle';
  }
}
