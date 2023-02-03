import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { GlobalUISettingsService } from '@shared/util-settings';
import { IconComponent } from '../icon/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent],
  selector: 'global-card',
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {
  @Input() public myTitle = '';
  @Input() public cardWidth = 'auto'; //fit , ?rem, ?vw, ?px, ?%
  @Input() public cardHeight = 'fit'; //auto , ?rem, ?vw, ?px, ?%
  @Input() public cardTheme = 'dark'; //or bright
  @Input() public icon = '';
  @Input() public iconStroke: string | number | undefined = 1.5;
  @Input() public iconSize = '1.5rem';
  @Input() public iconColor = '';
  @Input() public animate = false;
  @HostBinding('class') public class = 'block p-4 rounded-md';
  constructor(private elRef: ElementRef, public globalUISettings: GlobalUISettingsService) {}

  ngOnInit(): void {
    if (this.cardWidth === 'fit') {
      this.class += ' w-fit';
    } else if (this.cardWidth !== '') {
      this.elRef.nativeElement.style.width = this.cardWidth;
    }
    if (this.cardHeight === 'fit') {
      this.class += ' h-fit';
    } else if (this.cardHeight !== '') {
      this.elRef.nativeElement.style.width = this.cardWidth;
    }
    if (this.cardTheme === 'bright') {
      this.class += ' bg-tertiary text-textB';
    } else {
      this.class += ' bg-bgB text-textA border border-secondary';
    }
    if (this.animate) {
      this.class += ' ' + this.globalUISettings.AnimationType;
    }
  }
}
