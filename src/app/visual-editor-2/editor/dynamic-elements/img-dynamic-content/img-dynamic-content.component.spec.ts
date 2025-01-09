import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgDynamicContentComponent, ImgDynamicContentData } from './img-dynamic-content.component';
import { VisualElement } from '../../models';

describe('ImgDynamicContentComponent', () => {
  let component: ImgDynamicContentComponent;
  let fixture: ComponentFixture<ImgDynamicContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgDynamicContentComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ImgDynamicContentComponent);
    component = fixture.componentInstance;
    component.element = { data: { imageUrl: 'src/dummy/url' } } as VisualElement<unknown, ImgDynamicContentData>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
