import { TestBed } from '@angular/core/testing';
import { ButtonStandardComponent } from './button-standard.component';

describe(ButtonStandardComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(ButtonStandardComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(ButtonStandardComponent, {
           componentProperties: {
               height:  'small',
               width:  '',
               icon:  '',
               ownColor:  false,
               autofocus:  false,
               disabled:  false,
          }
       });
  })

})
