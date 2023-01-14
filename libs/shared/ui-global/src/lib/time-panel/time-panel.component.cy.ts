import { TestBed } from '@angular/core/testing';
import { TimePanelComponent } from './time-panel.component';

describe(TimePanelComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(TimePanelComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(TimePanelComponent, {
           componentProperties: {
               entryIndex:  0,
               data:  { time: '00:00', days: [] },
               disabled:  false,
          }
       });
  })

})
