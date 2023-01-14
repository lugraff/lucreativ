import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavigationFetcher, navElement } from '@shared/util-authentication';
import { GlobalNavigationComponent } from './navigation.component';
@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, GlobalNavigationComponent],
  selector: 'global-navigation-home-page',
  template: ` <div class="flex flex-col h-screen items-stretch">
    <!-- top navigation -->
    <div>
      <global-navigation
        [mainRoute]="mainRoute"
        [navElements]="navElements"></global-navigation>
    </div>
    <!-- MAIN -->
    <div class="flex-grow overflow-auto">
      <router-outlet></router-outlet>
    </div>
  </div>`,
})
export class GlobalNavigationHomeComponent implements OnInit {
  public mainRoute = '';
  public navElements: navElement[] = [];

  constructor(private activatedRoute: ActivatedRoute, private vmProvider: NavigationFetcher) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.mainRoute = params['mainRoute'];
      this.vmProvider.fetchLinksForRoute(this.mainRoute).then((links) => {
        const navElements: navElement[] = links.map((navElement) => {
          return <navElement>{
            route: navElement.route,
            viewModelHref: navElement.link,
            fullName: navElement.caption,
            shortName: navElement.caption,
            icon: navElement.icon,
            subRoutes: [],
          };
        });
        this.navElements = navElements;
      });
    });
  }
}
