import { TestBed } from '@angular/core/testing';
import { StandardIconsComponent } from './standard-icons.component';

describe(StandardIconsComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(StandardIconsComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(StandardIconsComponent, {
           componentProperties: {
               icon:  undefined,
               text:  '',
               ownColor:  false,
          }
       });
  })

})
