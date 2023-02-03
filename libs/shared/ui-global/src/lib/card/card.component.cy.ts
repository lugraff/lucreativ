import { Component } from '@angular/core';
import { CardComponent } from './card.component';

@Component({
  standalone: true,
  imports: [CardComponent],
  template: `<global-card
    [myTitle]="myTitle"
    [cardWidth]="cardWidth"
    [cardHeight]="cardHeight"
    [cardTheme]="cardTheme"
    [icon]="icon"
    [iconStroke]="iconStroke"
    [iconSize]="iconSize"
    [iconColor]="iconColor"
    [animate]="animate">
    Card Content
  </global-card>`,
})
class TestHostComponent {
  myTitle = 'Card';
  cardWidth = '50vw';
  cardHeight = 'fit';
  cardTheme = 'bright';
  icon = 'featherInfo';
  iconStroke = undefined;
  iconSize = '2rem';
  iconColor = '';
  animate = false;
}

describe(CardComponent.name, () => {
  it('should mount CardComponent', () => {
    cy.mount(CardComponent, {
      componentProperties: {
        myTitle: '',
      },
    });
  });

  it('should mount CardComponent with Title "Card".', () => {
    cy.mount(CardComponent, {
      componentProperties: {
        myTitle: 'Card',
      },
    });
    cy.get('div').eq(2).should('have.text', ' Card\n');
  });

  it('should mount TestHostComponent with right settings.', () => {
    cy.mount(TestHostComponent, {});
    cy.get('div').eq(2).should('have.text', ' Card\n');
    cy.get('global-card').invoke('attr', 'ng-reflect-card-width').should('equal', '50vw');
    cy.get('global-card').invoke('attr', 'ng-reflect-card-height').should('equal', 'fit');
    cy.get('global-card').invoke('attr', 'ng-reflect-card-theme').should('equal', 'bright');
    cy.get('global-card').invoke('attr', 'ng-reflect-icon').should('equal', 'featherInfo');
    cy.get('global-card').invoke('attr', 'ng-reflect-icon-stroke').should('equal', undefined);
    cy.get('global-card').invoke('attr', 'ng-reflect-icon-size').should('equal', '2rem');
    cy.get('global-card').invoke('attr', 'ng-reflect-icon-color').should('equal', '');
    cy.get('global-card').invoke('attr', 'ng-reflect-animate').should('equal', 'false');
  });
});
