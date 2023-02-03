import { Component } from '@angular/core';
import { InfoPopupComponent } from './info-popup.component';

@Component({
  standalone: true,
  imports: [InfoPopupComponent],
  template: `<global-info-popup
    [icon]="icon"
    [iconColor]="iconColor"
    [iconStroke]="iconStroke"
    [iconSize]="iconSize"
    [infoText]="infoText"
    [infoTimeout]="infoTimeout"
    [infoPosition]="infoPosition"
    [infoAlign]="infoAlign"
    [infoOffset]="infoOffset">
  </global-info-popup>`,
})
class TestHostComponent {
  icon = 'featherInfo';
  iconColor = 'warning';
  iconStroke = 1.5;
  iconSize = '1.5rem';
  infoText = 'Test';
  infoTimeout = 400;
  infoPosition = 'top';
  infoAlign = 'center';
  infoOffset = 32;
}

describe(InfoPopupComponent.name, () => {
  it('should mount InfoPopupComponent', () => {
    cy.mount(TestHostComponent);
  });

  it('should mount TestHostComponent', () => {
    cy.mount(TestHostComponent);
  });

  it('should mount TestHostComponent with right settings and disappear after info-timeout.', () => {
    cy.mount(TestHostComponent);
    cy.get('global-info-popup').should('have.text', ' Test ');
    cy.get('global-info-popup').invoke('attr', 'ng-reflect-icon').should('equal', 'featherInfo');
    cy.get('global-info-popup').invoke('attr', 'ng-reflect-icon-color').should('equal', 'warning');
    cy.get('global-info-popup').invoke('attr', 'ng-reflect-icon-stroke').should('equal', '1.5');
    cy.get('global-info-popup').invoke('attr', 'ng-reflect-icon-size').should('equal', '1.5rem');
    cy.get('global-info-popup').invoke('attr', 'ng-reflect-info-text').should('equal', 'Test');
    cy.get('global-info-popup').invoke('attr', 'ng-reflect-info-timeout').should('equal', '400');
    cy.get('global-info-popup').invoke('attr', 'ng-reflect-info-position').should('equal', 'top');
    cy.get('global-info-popup').invoke('attr', 'ng-reflect-info-align').should('equal', 'center');
    cy.get('global-info-popup').invoke('attr', 'ng-reflect-info-offset').should('equal', '32');
    cy.wait(500).get('global-info-popup').should('have.text', '');
  });
});
