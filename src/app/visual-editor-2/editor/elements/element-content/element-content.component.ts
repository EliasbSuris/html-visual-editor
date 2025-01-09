import {
  ChangeDetectionStrategy,
  Component,
  ComponentMirror,
  ComponentRef,
  EnvironmentInjector,
  Inject,
  input,
  OnChanges,
  OnInit,
  Optional,
  reflectComponentType,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DynamicContentInput } from './element-content-inputs';
import { DYNAMIC_VISUAL_CONTENT_LOADER, DynamicVisualContentLoaderService } from '../dynamic-visual-content-loader';
import { VisualElement } from '../visual-element';
import { convertToVisualElementMetadata } from '../visual-element-metadata';

/** Component used to render dynamic components and apply content common styles. */
@Component({
  selector: 'aor-element-content',
  templateUrl: './element-content.component.html',
  styleUrls: ['./element-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementContentComponent implements OnInit, OnChanges {
  /** ViewContainerRef where the dynamic content component will be rendered. */
  @ViewChild('dynamicContent', { read: ViewContainerRef, static: true })
  private dynamicContentRef!: ViewContainerRef;
  /** If no DynamicVisualContentLoaderService provided will render these template as fallback */
  @ViewChild('noContent', { static: true })
  private noContentElementRef!: TemplateRef<unknown>;

  /** VisualElement configuration to render the dynamic content component. */
  public element = input.required<VisualElement>();
  /** VisualElement metadata. */
  public metadata = input.required({ transform: convertToVisualElementMetadata });

  private dynamicElement!: Type<unknown>;
  private dynamicElementMirror!: ComponentMirror<unknown> | null;
  private dynamicComponentRef!: ComponentRef<unknown>;

  constructor(
    @Inject(DYNAMIC_VISUAL_CONTENT_LOADER)
    @Optional()
    private readonly dynamicContentLoader: DynamicVisualContentLoaderService,
    private readonly envInjector: EnvironmentInjector
  ) {}

  ngOnInit(): void {
    this.loadDynamicElement();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dynamicComponentRef && this.dynamicElementMirror) {
      if (changes['element'] && !changes['element'].firstChange && changes['element'].currentValue) {
        this.setInputIfExists(
          'element',
          changes['element'].currentValue,
          this.dynamicComponentRef,
          this.dynamicElementMirror
        );
      }
      if (changes['metadata'] && !changes['metadata'].firstChange && changes['metadata'].currentValue) {
        this.setInputIfExists(
          'metadata',
          changes['metadata'].currentValue,
          this.dynamicComponentRef,
          this.dynamicElementMirror
        );
      }
    }
  }

  private loadDynamicElement(): void {
    console.log('LOADING DYNAMIC ELEMENT', this.dynamicContentLoader);
    if (this.dynamicContentLoader) {
      this.dynamicElement = this.dynamicContentLoader.getDynamicContent(this.element().type);
      this.dynamicComponentRef = this.dynamicContentRef.createComponent(this.dynamicElement, {
        environmentInjector: this.envInjector,
      });
      this.dynamicElementMirror = reflectComponentType(this.dynamicElement);
      this.setInputIfExists('element', this.element(), this.dynamicComponentRef, this.dynamicElementMirror);
      this.setInputIfExists('metadata', this.metadata(), this.dynamicComponentRef, this.dynamicElementMirror);
    } else {
      this.dynamicContentRef.createEmbeddedView(this.noContentElementRef);
    }
  }

  private setInputIfExists(
    inputName: DynamicContentInput,
    value: unknown,
    dynamicComponentRef: ComponentRef<unknown>,
    dynamicElementMirror: ComponentMirror<unknown> | null
  ): void {
    if (this.hasInput(dynamicElementMirror?.inputs, inputName)) {
      dynamicComponentRef.setInput(inputName, value);
    }
  }

  private hasInput(
    inputs:
      | ReadonlyArray<{
          readonly propName: string;
          readonly templateName: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          readonly transform?: (value: any) => any;
          readonly isSignal: boolean;
        }>
      | undefined,
    inputName: DynamicContentInput
  ): boolean {
    return !!inputs && inputs.some(input => input.templateName === inputName);
  }
}
