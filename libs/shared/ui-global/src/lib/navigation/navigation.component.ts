import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';
import { RemoveString, UppercaseStringSplitterPipe } from '@shared/util-strings';
import { ButtonLinkComponent } from '../button-link/button-link.component';
import { LocalSettingsComponent } from '../local-settings/local-settings.component';
import { PopupComponent } from '../popup/popup.component';
import { TooltipDirective } from '@shared/util-global';

@Component({
  selector: 'global-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UppercaseStringSplitterPipe,
    RemoveString,
    ButtonLinkComponent,
    LocalSettingsComponent,
    PopupComponent,
    TooltipDirective,
  ],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  public showLocalSettings = false;
  public expanded = false;
  public version = '1.1.2';

  constructor(public router: Router) {}

  public getRouteData(route: Route): string {
    if (route.data !== undefined) {
      return route.data[0];
    }
    return '';
  }
}
