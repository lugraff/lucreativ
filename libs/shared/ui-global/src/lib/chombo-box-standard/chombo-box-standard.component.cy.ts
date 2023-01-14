import { TestBed } from '@angular/core/testing';
import { ChomboBoxStandardComponent } from './chombo-box-standard.component';

describe(ChomboBoxStandardComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(ChomboBoxStandardComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(ChomboBoxStandardComponent, {
           componentProperties: {
               notAvailableText:  '-',
               height:  32,
               width:  'fit',
               data:  [],
          }
       });
  })

})
