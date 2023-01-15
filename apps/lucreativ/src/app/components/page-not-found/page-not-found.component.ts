import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'lucreativ-page-not-found',
  templateUrl: './page-not-found.component.html',
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  public animationTicker = true;
  constructor() {
    this.sub = interval(2800).subscribe(() => {
      this.animationTicker = !this.animationTicker;
    });
  }

  public ngOnInit(): void {
    setTimeout(() => (this.animationTicker = false), 500);
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
