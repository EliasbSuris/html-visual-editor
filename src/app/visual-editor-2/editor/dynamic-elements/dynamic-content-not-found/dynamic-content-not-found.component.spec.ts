import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicContentNotFoundComponent } from './dynamic-content-not-found.component';

describe('DynamicContentNotFoundComponent', () => {
  let component: DynamicContentNotFoundComponent;
  let fixture: ComponentFixture<DynamicContentNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicContentNotFoundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicContentNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
