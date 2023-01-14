import { TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';

describe(SearchComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(SearchComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(SearchComponent, {
           componentProperties: {
               searchStrings:  [],
          }
       });
  })

})
