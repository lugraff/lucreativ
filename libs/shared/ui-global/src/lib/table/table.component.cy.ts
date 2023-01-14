import { TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';

describe(TableComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(TableComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(TableComponent, {
           componentProperties: {
               maxWindowHeight:  '100%',
               maxWindowWidth:  '100%',
               tableData:  emptyTable,
               tooltipPos:  'bottom',
               tooltipLineBreak:  false,
               tooltipWidth:  'fit',
          }
       });
  })

})
