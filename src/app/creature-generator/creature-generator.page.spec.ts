import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatureGeneratorPage } from './creature-generator.page';

describe('CreatureGeneratorPage', () => {
  let component: CreatureGeneratorPage;
  let fixture: ComponentFixture<CreatureGeneratorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureGeneratorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
