import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { VisualElement } from '@v2/editor/elements/visual-element';
import { Chart as ChartInstance, ChartModule } from 'angular-highcharts';
import { Chart } from 'highcharts';

@Component({
  imports: [ChartModule],
  templateUrl: './linear-chart-dynamic-content.component.html',
  styleUrl: './linear-chart-dynamic-content.component.scss',
})
export class LinearChartDynamicContentComponent implements OnInit, OnDestroy {
  @Input()
  element!: VisualElement;

  chart!: Chart;
  chartResizeObserver!: ResizeObserver;

  chartInstance = new ChartInstance({
    chart: {
      type: 'line',
    },
    title: {
      text: 'Linechart',
    },
    credits: {
      enabled: false,
    },
  });

  private cdCounter = 0;

  constructor(
    private elementRef: ElementRef<HTMLDivElement>,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.subscribeToChartRef();
  }

  ngOnDestroy(): void {
    this.chartResizeObserver.unobserve(this.elementRef.nativeElement);
  }

  subscribeToChartRef(): void {
    this.chartInstance.ref$.subscribe(chart => {
      this.chart = chart;
      this.chart.setTitle({ text: this.element.text });
      this.chart.addSeries({
        type: 'line',
        name: `Line ${this.element.id}`,
        data: [this.element.height, this.element.width, this.element.x, this.element.y],
      });
      setInterval(() => {
        this.chart.series[0].remove();
        this.chart.addSeries(
          {
            type: 'line',
            name: `Line ${this.element.id}`,
            data: [
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
            ],
          },
          true
        );
      }, 1500);
      this.chartResizeObserver = new ResizeObserver(entries => {
        const [chart] = entries ?? [];
        if (!chart) {
          return;
        }
        this.zone.run(() => this.onChartResize(chart.contentRect.height, chart.contentRect.width));
      });
      this.chartResizeObserver.observe(this.elementRef.nativeElement);
    });
  }

  onChartResize(newHeight: number, newWidth: number): void {
    this.chart.setSize(newWidth, newHeight);
  }
}
