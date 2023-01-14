import { TestBed } from '@angular/core/testing';
import { EliteLogoComponent } from './elite-logo.component';

describe(EliteLogoComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(EliteLogoComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(EliteLogoComponent, {
           componentProperties: {
               elementId:  null,
               showLogo:  true,
               showLogoText:  true,
               playingAnimation:  false,
               changeAnimation:  false,
               presetName:  '',
          }
       });
  })

})
