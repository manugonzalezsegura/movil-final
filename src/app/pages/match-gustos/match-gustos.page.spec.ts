import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchGustosPage } from './match-gustos.page';

describe('MatchGustosPage', () => {
  let component: MatchGustosPage;
  let fixture: ComponentFixture<MatchGustosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchGustosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
