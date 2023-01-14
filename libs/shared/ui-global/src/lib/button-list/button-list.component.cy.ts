import { TestBed } from '@angular/core/testing';
import { ButtonListComponent } from './button-list.component';

describe(ButtonListComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(ButtonListComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(ButtonListComponent, {
           componentProperties: {
               height:  'small',
               width:  '',
               icon:  '',
               ownColor:  false,
               disabled:  false,
               activeLink:  false,
          }
       });
  })

})
