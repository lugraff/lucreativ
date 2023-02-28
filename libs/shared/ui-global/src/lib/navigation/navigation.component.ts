import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { ButtonLinkComponent } from '../button-link/button-link.component';
import { LocalSettingsComponent } from '../local-settings/local-settings.component';
import { PopupComponent } from '../popup/popup.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { CanComponentDeactivate } from '@shared/util-global';
import { Observable } from 'rxjs';

@Component({
  selector: 'global-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonLinkComponent, LocalSettingsComponent, PopupComponent, TooltipDirective],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  public showLocalSettings = false;
  public expanded = false;
  public version = '1.2.2';

  constructor(public router: Router) {}

  public getRouteData(route: Route): string {
    if (route.data !== undefined) {
      return route.data[0];
    }
    return '';
  }
}
