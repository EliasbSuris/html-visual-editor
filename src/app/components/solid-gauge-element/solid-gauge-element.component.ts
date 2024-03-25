import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MapObject } from '@models/map-object.interface';
import { Chart as ChartInstance, ChartModule } from 'angular-highcharts';
import { Chart } from 'highcharts';

@Component({
  selector: 'aor-solid-gauge-element',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './solid-gauge-element.component.html',
  styleUrl: './solid-gauge-element.component.scss',
})
export class SolidGaugeElementComponent implements OnInit, OnDestroy {
  @Input()
  element!: MapObject;

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
    series: [
      {
        type: 'line',
        name: 'Line 1',
        data: [1, 2, 3],
      },
    ],
  });

  private cdCounter = 0;

  constructor(
    private elementRef: ElementRef<HTMLDivElement>,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.subcribeToChartRef();
  }

  ngOnDestroy(): void {
    this.chartResizeObserver.unobserve(this.elementRef.nativeElement);
  }

  subcribeToChartRef(): void {
    this.chartInstance.ref$.subscribe(chart => {
      this.chart = chart;
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

  cdFired(): void {
    console.log(`%cCD FOR CHART ELEMENT ${this.element.text}`, 'color: #2f9e44');
    this.cdCounter++;
    console.log(`%c${this.cdCounter}`, 'color: #2f9e44; font-size: 18px');
  }
}
