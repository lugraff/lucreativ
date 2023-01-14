import { Component } from '@angular/core';
import { ButtonEliteComponent } from './button-elite.component';

@Component({
  standalone: true,
  imports: [ButtonEliteComponent],
  template: `<button
    elite
    autofocus>
    Hello World
  </button>`,
})
class TestHostComponent {}

@Component({
  standalone: true,
  imports: [ButtonEliteComponent],
  template: `<button
    elite
    disabled>
    Hello World2
  </button>`,
})
class TestHostDisabledComponent {}

describe('ButtonEliteComponent', () => {
  it('should mount ButtonEliteComponent', () => {
    cy.mount(ButtonEliteComponent);
  });
  it('should mount TestHostComponent', () => {
    cy.mount(TestHostComponent);
  });
  it('should render button with bg-primary and button text and autofocused', () => {
    cy.mount(TestHostComponent);
    cy.get('button').should('have.text', ' Hello World ');
    cy.get('button').should('have.attr', 'autofocus');
    cy.get('button').should('have.class', 'bg-primary');
    cy.get('button').should('have.class', 'active:bg-textA');
    cy.get('button').should('have.class', 'hover:skew-x-[20deg]');
    cy.get('div').should('have.class', 'group-hover:-skew-x-[20deg]');
  });
  it('should be disabled when disabled set to true and render in grayscale', () => {
    cy.mount(TestHostDisabledComponent);
    cy.get('button').should('have.attr', 'disabled');
    cy.get('button').should('have.class', 'disabled:grayscale');
  });
});
