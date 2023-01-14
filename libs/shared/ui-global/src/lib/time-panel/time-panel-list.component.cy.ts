import { TestBed } from '@angular/core/testing';
import { TimePanelListComponent } from './time-panel-list.component';

describe(TimePanelListComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(TimePanelListComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(TimePanelListComponent, {
           componentProperties: {
               timeWithDaysList:  [],
          }
       });
  })

})
