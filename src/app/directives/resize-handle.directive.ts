import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';
import { ObjectValues } from '@custom-types/utils.type';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import { ResizeContainerDirective } from './resize-container.directive';
import { ResizeElementDirective } from './resize-element.directive';

export const RESIZE_ACTION = {
  S: 'S',
  E: 'E',
  SE: 'SE',
  NONE: 'NONE',
} as const;

export type ResizeAction = ObjectValues<typeof RESIZE_ACTION>;

type EventListener = 'mouseup' | 'mousemove';

@Directive({
  selector: '[aorResizeHandle]',
  standalone: true,
})
export class ResizeHandleDirective implements OnInit, OnDestroy {
  @Input()
  resizeAction: ResizeAction = 'NONE';

  @HostBinding('style.height.px')
  private height!: number;
  @HostBinding('style.width.px')
  private width!: number;
  @HostBinding('style.margin-bottom.px')
  private marginBottom!: number;
  @HostBinding('style.margin-right.px')
  private marginRight!: number;

  private resizeContainerDirective = inject(ResizeContainerDirective, { optional: true });
  private resizeElementDirective = inject(ResizeElementDirective);
  private renderer = inject(Renderer2);
  private elementRef: ElementRef<Element> = inject(ElementRef);
  private zone = inject(NgZone);
  private resizeContainer!: Element | Document;

  private eventListeners: Partial<Record<EventListener, () => void>> = {};

  private destroy$ = new Subject<void>();

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    // If no resize container aviable pick document as resize container
    this.resizeContainer = this.resizeContainerDirective?.elementRef.nativeElement ?? document;
    this.zone.runOutsideAngular(() =>
      fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousedown')
        .pipe(takeUntil(this.destroy$))
        .subscribe(event => this.onMouseDown(event))
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.resizeAction === 'NONE') {
      return;
    }
    this.resizeElementDirective.initResize(event, this.resizeAction);
    this.eventListeners.mousemove = this.renderer.listen(
      this.resizeContainer,
      'mousemove',
      (mouseMoveEvent: MouseEvent) => this.onMouseMove(mouseMoveEvent)
    );
    this.eventListeners.mouseup = this.renderer.listen(this.document, 'mouseup', () => this.onMouseUp());
  }

  private onMouseUp(): void {
    this.document.removeEventListener('mouseup', () => this.onMouseUp.bind(this), false);
    Object.keys(this.eventListeners).forEach(type => {
      const listener = type as EventListener;
      this.eventListeners[listener]?.();
      delete this.eventListeners[listener];
    });
  }

  private onMouseMove(event: MouseEvent): void {
    event.stopPropagation();
    this.resizeElementDirective.doResize(event);
  }
}
