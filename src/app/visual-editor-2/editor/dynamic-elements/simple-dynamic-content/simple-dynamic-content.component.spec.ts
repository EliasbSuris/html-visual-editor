import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDynamicContentComponent } from './simple-dynamic-content.component';

describe('SimpleDynamicContentComponent', () => {
  let component: SimpleDynamicContentComponent;
  let fixture: ComponentFixture<SimpleDynamicContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleDynamicContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleDynamicContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
