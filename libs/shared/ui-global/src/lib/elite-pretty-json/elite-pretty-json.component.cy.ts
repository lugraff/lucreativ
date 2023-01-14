import { TestBed } from '@angular/core/testing';
import { ElitePrettyJsonComponent } from './elite-pretty-json.component';

describe(ElitePrettyJsonComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(ElitePrettyJsonComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(ElitePrettyJsonComponent,);
  })

})
