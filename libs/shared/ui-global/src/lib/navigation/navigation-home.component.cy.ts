import { TestBed } from '@angular/core/testing';
import { GlobalNavigationHomeComponent } from './navigation-home.component';

describe(GlobalNavigationHomeComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(GlobalNavigationHomeComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(GlobalNavigationHomeComponent,);
  })

})
