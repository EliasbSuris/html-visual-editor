import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgDynamicContentComponent, SvgDynamicContentData } from './svg-dynamic-content.component';
import { VisualElement } from '../../models';

describe('SvgDynamicContentComponent', () => {
  let component: SvgDynamicContentComponent;
  let fixture: ComponentFixture<SvgDynamicContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgDynamicContentComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SvgDynamicContentComponent);
    component = fixture.componentInstance;
    component.element = { data: { svg: '' } as SvgDynamicContentData } as VisualElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
