import { TestBed } from '@angular/core/testing';
import { InputStandardComponent } from './input-standard.component';

describe(InputStandardComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(InputStandardComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(InputStandardComponent, {
           componentProperties: {
               inputType:  'text',
               inputText:  '',
               icon:  '',
               ownColor:  false,
               placeholderText:  '',
               selectAllOnFocus:  false,
               maxLength:  -1,
               readonly:  false,
               height:  'small',
               width:  -1,
               autofocus:  false,
               disabled:  false,
          }
       });
  })

})
