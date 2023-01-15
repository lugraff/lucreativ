import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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

  constructor(public router: Router) {}
}
