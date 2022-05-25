import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { EChartsOption } from 'echarts';
import { GameTableRow } from 'src/app/models/game-table-row.interface';

@Component({
  selector: 'app-game-chart',
  templateUrl: './game-chart.component.html',
  styleUrls: ['./game-chart.component.css']
})
export class GameChartComponent implements OnChanges {
  @ViewChild(MatTable) matTable!: MatTable<GameTableRow>;
  @Input() cleanStrategyPayouts: any[] = [];
  @Input() nashEquilibriumPayouts: number[][] = [];
  @Input() correlatedEquilibriumPayouts: number[][] = [];
  @Input() paretoFront: number[][] = [];
  @Input() gameTitle = '';
  chartOptions!: EChartsOption;
  scatterChartSeriesOptions: any;
  nashEffectScatterChartSeriesOptions: any;
  correlatedEffectScatterChartSeriesOptions: any;

  @Input() rows:GameTableRow[] = [];
  @Input() headers: string[] = [];

  ngOnChanges(): void {
    // this.scatterChartData = this.cleanStrategyPayouts;
    // this.nashEquilibriumPayouts.forEach((payouts) => {
    //   this.scatterChartData.push(payouts);
    // });
    if (this.matTable) {
      this.matTable.renderRows();
    }

    this.correlatedEffectScatterChartSeriesOptions = {
      type: 'effectScatter',
      symbolSize: 20,
      data: this.correlatedEquilibriumPayouts,
      label: {
        show: true,
        position: 'bottom',
        formatter: 'CE {@[0]}, {@[1]}'
      },
      tooltip: {
        formatter: function (params: any, ticket: any, callback: any) {
          return `${params.value[0]}, ${params.value[1]}`
        },
      }
    };

    this.scatterChartSeriesOptions = {
      type: 'scatter',
      clip: false,
      data: this.cleanStrategyPayouts,
      label: {
        show: true,
        position: 'top',
        formatter: '{@[2]}, {@[3]}',
      },
      tooltip: {
        formatter: function (params: any, ticket: any, callback: any) {
          return `${params.value[0]}, ${params.value[1]}`
        },
      }
    };

    this.nashEffectScatterChartSeriesOptions = {
      type: 'effectScatter',
      data: this.nashEquilibriumPayouts,
      label: {
        show: true,
        position: 'bottom',
        formatter: 'NE {@[0]}, {@[1]}'
      },
      tooltip: {
        formatter: function (params: any, ticket: any, callback: any) {
          return `${params.value[0]}, ${params.value[1]}`
        },
      }
    };

    this.setChartOptions();
  }

  setChartOptions(): void {
    this.chartOptions = {
      title: {
        text: this.gameTitle
      },
      xAxis: {
        name: 'Wypłata pierwszego gracza [-]',
        nameLocation: 'middle',
        type: 'value',
        nameGap: 20,
        boundaryGap: ['20%', '20%']
      },
      yAxis: {
        name: 'Wypłata drugiego gracza [-]',
        nameLocation: 'middle',
        type: 'value',
        nameGap: 20,
        boundaryGap: ['20%', '20%']
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        this.nashEffectScatterChartSeriesOptions,
        this.correlatedEffectScatterChartSeriesOptions,
        this.scatterChartSeriesOptions,
        {
          data: this.paretoFront,
          type: 'line',
          lineStyle: {
            type: 'dashed',
            color: '#3393FF',
            width: 4
          }
        },
        {
          type: 'custom',
          z: -1,
          renderItem: (params, api) => {
            if (params.context['rendered']) {
              return {};
            }
            params.context['rendered'] = true;
            const points: number[][] = [];
            for (let i = 0; i < this.cleanStrategyPayouts.length; i++) {
              points.push(api.coord(this.cleanStrategyPayouts[i]));
            }
            return {
              type: 'polygon',
              transition: ['shape'],
              shape: {
                points: points
              },
              style: {
                fill: 'orange',
                stroke: 'grey'
              }
            };
          },
          clip: false,
          data: this.cleanStrategyPayouts
        }
      ]
    };
  }
}
