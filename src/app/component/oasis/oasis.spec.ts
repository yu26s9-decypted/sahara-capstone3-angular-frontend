import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Oasis } from './oasis';

describe('Oasis', () => {
  let component: Oasis;
  let fixture: ComponentFixture<Oasis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Oasis],
    }).compileComponents();

    fixture = TestBed.createComponent(Oasis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
