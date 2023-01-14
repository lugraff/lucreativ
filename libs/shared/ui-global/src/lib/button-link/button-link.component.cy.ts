import { TestBed } from '@angular/core/testing';
import { ButtonLinkComponent } from './button-link.component';

describe(ButtonLinkComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(ButtonLinkComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(ButtonLinkComponent, {
           componentProperties: {
               height:  'medium',
               width:  '',
               icon:  '',
               ownColor:  false,
               disabled:  false,
               activLink:  false,
          }
       });
  })

})
