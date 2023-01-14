import { TestBed } from '@angular/core/testing';
import { TooltipComponent } from './tooltip.component';

describe(TooltipComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(TooltipComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(TooltipComponent,);
  })

})
