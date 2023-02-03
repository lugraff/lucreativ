import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';
import { RemoveString, UppercaseStringSplitterPipe } from '@shared/util-strings';
import { ButtonLinkComponent } from '../button-link/button-link.component';

@Component({
  selector: 'global-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, UppercaseStringSplitterPipe, RemoveString, ButtonLinkComponent],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  public expanded = false;
  public version = '1.1.0';

  constructor(public router: Router) {}

  public getRouteData(route: Route): string {
    if (route.data !== undefined) {
      return route.data[0];
    }
    return '';
  }
}
