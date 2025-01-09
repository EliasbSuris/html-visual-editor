import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Input, NgZone, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import { ObjectValues } from '../../../types/utils.type';
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
})
export class ResizeHandleDirective implements OnInit, OnDestroy {
  @Input()
  public resizeAction: ResizeAction = 'NONE';

  private resizeContainerDirective = inject(ResizeContainerDirective, { optional: true });
  private resizeElementDirective = inject(ResizeElementDirective);
  private resizeContainer!: Element | Document;

  private eventListeners: Partial<Record<EventListener, () => void>> = {};

  private destroy$ = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly renderer: Renderer2,
    private readonly elementRef: ElementRef<Element>,
    private readonly zone: NgZone
  ) {}

  ngOnInit(): void {
    // If no resize container available pick document as resize container
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
    this.resizeElementDirective.elementResizeEnded();
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
