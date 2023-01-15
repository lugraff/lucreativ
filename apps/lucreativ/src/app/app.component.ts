import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from '@shared/ui-global';

@Component({
  standalone: true,
  selector: 'lucreativ-root',
  templateUrl: './app.component.html',
  imports: [CommonModule, RouterModule, NavigationComponent],
})
export class AppComponent {
  constructor(public routerModule: RouterModule){
  }
}
