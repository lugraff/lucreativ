import { TestBed } from '@angular/core/testing';
import { GlobalNavigationComponent } from './navigation.component';

describe(GlobalNavigationComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(GlobalNavigationComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(GlobalNavigationComponent, {
           componentProperties: {
               mainRoute:  '',
               subRoutes:  {},
               navElements:  [],
          }
       });
  })

})
