import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationComponent, TooltipComponent } from '@shared/ui-global';
import { MouseEventService } from '@shared/util-global';
import { take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'lucreativ-root',
  imports: [CommonModule, RouterModule, NavigationComponent, TooltipComponent],
  template: `<div
      class="w-screen h-screen flex font-normal text-textA selection:bg-bgB stroke-textA stroke-2 fill-transparent bg-bgA">
      <global-navigation></global-navigation>
      <div class="grow overflow-auto">
        <router-outlet></router-outlet>
      </div>
    </div>
    <global-tooltip></global-tooltip>

    <!-- Unterer Bereich ist für Preload animation:
  (wenn nicht vorhanden kann nicht zwischen Animationen geswitcht werden!) -->
    <div class="hidden absolute">
      <div
        class="animate-slideIn animate-slideOut animate-zoomIn animate-zoomOut animate-fadeIn animate-fadeOut animate-hover"></div>
    </div>`,
})
export class AppComponent {
  constructor(public routerModule: RouterModule, mouseEvents: MouseEventService) {
    mouseEvents.mouseLastEvent.pipe(take(1)).subscribe();
  }
}
