import { TestBed } from '@angular/core/testing';
import { PopupComponent } from './popup.component';

describe(PopupComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(PopupComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(PopupComponent, {
      componentProperties: {
        myTitle: '',
        closeable: true,
        resizeable: false,
        minimizeable: true,
        backCovered: true,
        popupWidth: '25%',
        appearX: '50%',
        appearY: '50%',
        appearMouse: '',
        icon: '',
      },
    });
  });
});
