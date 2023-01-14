import { TestBed } from '@angular/core/testing';
import { NotificationCardComponent } from './notification-card.component';

describe(NotificationCardComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(NotificationCardComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(NotificationCardComponent, {
           componentProperties: {
               icon:  '',
               ownColor:  false,
               animate:  false,
          }
       });
  })

})
