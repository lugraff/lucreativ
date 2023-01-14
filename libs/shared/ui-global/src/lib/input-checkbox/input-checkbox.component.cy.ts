import { TestBed } from '@angular/core/testing';
import { InputCheckboxComponent } from './input-checkbox.component';

describe(InputCheckboxComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(InputCheckboxComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(InputCheckboxComponent, {
           componentProperties: {
               elementId:  null,
               icon:  '',
               ownColor:  false,
               height:  'small',
               autofocus:  false,
               checked:  false,
          }
       });
  })

})
