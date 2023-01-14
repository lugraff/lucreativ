import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthJWTFacade, navElement } from '@shared/util-authentication';
import { Subscription } from 'rxjs';
import { ButtonStandardComponent } from '../button-standard/button-standard.component';
import { NotificationCardComponent } from '../notification-card/notification-card.component';
import { PopupComponent } from '../popup/popup.component';

@Component({
  standalone: true,
  imports: [CommonModule, PopupComponent, NotificationCardComponent, ButtonStandardComponent, RouterModule],
  selector: 'global-navigation',
  templateUrl: './navigation.component.html',
})
export class GlobalNavigationComponent implements OnDestroy, OnChanges {
  @Input() public mainRoute = '';
  @Input() public subRoutes: object = {};
  @Input() public navElements: navElement[] = [];
  public menuPoints: navElement[] = [];
  public actualRoute = '';
  public actualFullRoute = '';
  public fadeInTitel = false;
  public errorGetDataInfo = '';
  private subscriptions: Subscription[] = [];

  constructor(private authFacade: AuthJWTFacade, private router: Router) {
    this.subscriptions.push(
      //könnte zu früh sein...?
      this.router.events.subscribe((value) => {
        if (value instanceof NavigationEnd) {
          this.onNewRoute();
        }
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('New Maintenance Routes:');
    if (changes['navElements']) {
      if (changes['navElements'].currentValue.length > 0) {
        const newNavElements: navElement[] = changes['navElements'].currentValue;
        for (let index = 0; index < newNavElements.length; index++) {
          if (newNavElements[index].shortName === 'self') {
            // console.log('Self: ' + JSON.stringify(newNavElements[index]));
            newNavElements.splice(index, 1);
          }
        }
        this.menuPoints = newNavElements;
        // console.log(this.menuPoints);
        this.navigateToFirstRoute();
      } else {
        this.menuPoints = [];
      }
    }
  }

  private navigateToFirstRoute() {
    if (!this.menuPoints || this.menuPoints.length === 0) {
      return;
    }
    const splittedRoute = this.router.routerState.snapshot.url.split('/').pop();
    //hier wurde geschaut ob splittetroute zB 'info' ist und somit die startseite von Systeminfos. Dann wurde auf den ersten Menüpunkt navigiert.
    // console.log('navigateToFirstRoute:');
    // console.log(splittedRoute);
    // console.log(this.mainRoute);
    if (splittedRoute === this.mainRoute) {
      const navPoint = this.menuPoints[0];
      if (navPoint) {
        // console.log('Route to first Page: ' + navPoint.fullName);
        this.router.navigate([navPoint.route, navPoint.viewModelHref]);
      }
    }
  }

  public loadRoutes(): void {
    //ist glaub ich nur noch für Systeminfos da... kommt dann weg!
    this.unSub();
    this.errorGetDataInfo = '';
    this.subscriptions.push(
      this.authFacade.account$.subscribe({
        next: (value) => this.setMenuPoints(value.routes),
        error: (error) => (this.errorGetDataInfo = 'ERROR ' + error.status + '\n Routen konnten nicht geladen werden!'),
      })
    );
    this.subscriptions.push(
      //ACHTUNG das wird gebraucht-> subscribed sich zum Router und merkt wenn eine neue Route annavigiert wird.
      this.router.events.subscribe((value) => {
        if (value instanceof NavigationEnd) {
          this.onNewRoute();
        }
      })
    );
  }
  private setMenuPoints(routes: navElement[] | null): void {
    //ist glaub ich nur noch für Systeminfos da... kommt dann weg!
    this.menuPoints = [];

    if (this.navElements.length === 0) {
      if (routes === null) {
        return;
      }
      for (const route of routes) {
        if (route.route === this.mainRoute) {
          this.menuPoints = route.subRoutes;
          break;
        }
      }
    } else {
      this.menuPoints = this.navElements;
    }
    this.onNewRoute();
  }

  public ngOnDestroy(): void {
    this.unSub();
  }

  private unSub(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public onNewRoute(): void {
    // console.log('onNewRoute');
    this.actualRoute = decodeURIComponent(this.router.routerState.snapshot.url.split('/').pop() ?? '');
    this.actualFullRoute = decodeURIComponent(this.router.routerState.snapshot.url ?? '');
    // console.log(this.actualRoute);
    if (this.actualRoute === this.mainRoute) {
      this.navigateToFirstRoute();
      return;
    }
    this.fadeInTitel = true;
    for (const navPoint of this.menuPoints) {
      if (navPoint.route === this.router.routerState.snapshot.url.split('/').pop()) {
        this.actualRoute = navPoint.route;
        setTimeout(() => {
          const menuPointElement = document.getElementById(navPoint.route);
          if (menuPointElement !== null) {
            menuPointElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
          }
        }, 100);
        break;
      }
    }
    setTimeout(() => {
      this.fadeInTitel = false;
    }, 300);
  }

  public onMenuPoint(navPoint: navElement): void {
    this.router.navigate([this.mainRoute, navPoint.route]);
  }

  public onWheel(event: WheelEvent): void {
    const navContainer = document.getElementById('navContainer');
    if (navContainer !== null) {
      if (event.deltaY > 0) navContainer.scrollLeft += 40;
      else navContainer.scrollLeft -= 40;
    }
  }
}
