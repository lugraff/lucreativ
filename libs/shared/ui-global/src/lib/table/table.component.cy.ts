import { Component } from '@angular/core';
import { emptyTable, errorTable, TooltipDirective, TooltipService } from '@shared/util-global';
import { GlobalUISettingsService } from '@shared/util-settings';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { TableComponent } from './table.component';

@Component({
  standalone: true,
  imports: [TooltipComponent, TooltipDirective, TableComponent],
  providers: [
    TooltipService,
    { provide: GlobalUISettingsService, useValue: { TooltipKeyControl: false, ShowTooltips: true, TooltipDelay: 100 } },
  ],
  template: ` <global-table
      [tableData]="tableData"
      [ttPosition]="ttPos"
      [ttAlign]="ttAlign"
      [ttAnchor]="ttAnchor"
      [ttOffset]="ttOffset">
    </global-table>
    <global-tooltip></global-tooltip>`,
})
class TestHostComponent {
  tableData = emptyTable;
  ttPosition = 'top';
  ttAlign = 'center';
  ttAnchor = 'parent';
  ttOffset = '8';
}

describe(TableComponent.name, () => {
  it('should mount TableComponent', () => {
    cy.mount(TableComponent);
  });

  it('should mount TestHostComponent with emptyTable', () => {
    cy.mount(TestHostComponent, { componentProperties: { tableData: emptyTable } });
    cy.get('tr')
      .eq(1)
      .find('div')
      .eq(3)
      .should('have.text', ' Die Tabelle beinhaltet keine Daten bzw. Spalteninformationen! ');
  });

  it('should mount TestHostComponent with emptyTable', () => {
    cy.mount(TestHostComponent, { componentProperties: { tableData: errorTable } });
    cy.get('tr')
      .eq(1)
      .find('div')
      .eq(3)
      .should('have.text', ' Die Tabelle hat ein fehlerhaftes JSON-Format und konnte deshalb nicht geladen werden! ');
    // cy.get('global-table').should('')
    cy.get('global-table').then((val) => console.log(val[0]));
  });
});
// Info-Popup, Cell Actions, verschiedene tableData , scrollable
//TODO weiter Tests
