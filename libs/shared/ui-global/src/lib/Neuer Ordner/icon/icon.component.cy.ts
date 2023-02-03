import { Component } from '@angular/core';
import { IconComponent } from './icon.component';

@Component({
  standalone: true,
  imports: [IconComponent],
  template: `<div class="w-screen h-screen flex justify-center items-center">
    <global-icon
      [icon]="icon"
      [strokeWidth]="strokeWidth"
      [size]="size"
      [color]="color"></global-icon>
  </div>`,
})
class TestHostComponent {
  icon = 'featherInfo';
  strokeWidth = 2;
  size = '100%';
  color = '#999999';
}

describe(IconComponent.name, () => {
  it('should mount IconComponent', () => {
    cy.mount(IconComponent);
  });

  it('should mount TestHostComponent get right settings.', () => {
    cy.mount(TestHostComponent, {
      componentProperties: {
        icon: 'test',
        strokeWidth: 1.5,
        size: '99%',
        color: '#010203',
      },
    });
    cy.get('global-icon').invoke('attr', 'ng-reflect-icon').should('equal', 'test');
    cy.get('global-icon').invoke('attr', 'ng-reflect-stroke-width').should('equal', '1.5');
    cy.get('global-icon').invoke('attr', 'ng-reflect-size').should('equal', '99%');
    cy.get('global-icon').invoke('attr', 'ng-reflect-color').should('equal', '#010203');
  });

  it('should show ? Icon and not http img.', () => {
    cy.mount(TestHostComponent, {
      componentProperties: {
        icon: 'xxx',
        strokeWidth: 2,
        size: '100%',
        color: '#000000',
      },
    });
    cy.get('ng-icon').should('exist');
    cy.get('img').should('not.exist');
  });

  it('should show http img and not ngIcon.', () => {
    cy.mount(TestHostComponent, {
      componentProperties: {
        icon: 'http',
        strokeWidth: 2,
        size: '100%',
        color: 'primary',
      },
    });
    cy.get('ng-icon').should('not.exist');
    cy.get('img').should('exist');
  });

  it('should show Icon with primary color.', () => {
    cy.mount(TestHostComponent, {
      componentProperties: {
        icon: 'featherChevronsUp',
        strokeWidth: 1,
        size: '100%',
        color: 'primary',
      },
    });
    cy.get('ng-icon').invoke('attr', 'ng-reflect-color').should('equal', '#9de04b');
  });

  it('should show Icon with warning color.', () => {
    cy.mount(TestHostComponent, {
      componentProperties: {
        icon: 'featherChevronsDown',
        strokeWidth: 1,
        size: '100%',
        color: 'warning',
      },
    });
    cy.get('ng-icon').invoke('attr', 'ng-reflect-color').should('equal', '#ffcc00');
  });

  it('should show Icon with danger color.', () => {
    cy.mount(TestHostComponent, {
      componentProperties: {
        icon: 'featherChevronsUp',
        strokeWidth: 1,
        size: '100%',
        color: 'danger',
      },
    });
    cy.get('ng-icon').invoke('attr', 'ng-reflect-color').should('equal', '#f54b4c');
  });
});
