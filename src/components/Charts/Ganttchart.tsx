import React, { useEffect, useState, useRef } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highcharts-gantt";
import HighchartMore from "highcharts/highcharts-more";

HighchartMore(Highcharts);

type Series = {
  data: Array<{ x: number; y: number }>; // Replace with the actual properties of your series
};

export interface GanttChartData {
  chartTitle: string;
  chartTitleAlign: Highcharts.AlignValue | undefined | string;
  series: Series[];
  height?: number;
}

const GanttChart: React.FC<GanttChartData> = ({ chartTitle, chartTitleAlign, series, height }) => {

console.log(series);
  

  const [chartOptions, setChartOptions] = useState({
    chart: {
      
      height: height || 400, // Set a default height or use the provided height prop
    },
    title: {
      text: "",
  },

  yAxis: {
      uniqueNames: true,
  },

  navigator: {
      enabled: true,
      liveRedraw: true,
      series: {
          type: "gantt",
          pointPlacement: 0.5,
          pointPadding: 0.25,
          accessibility: {
              enabled: true,
          },
      },
      yAxis: {
          min: 0,
          max: 3,
          reversed: true,
          categories: [],
      },
  },

  scrollbar: {
      enabled: true,
  },

  rangeSelector: {
      enabled: true,
      selected: 0,
  },

  accessibility: {
      point: {
          descriptionFormatter: function (point:any) {
              var completedValue = point.completed ? point.completed.amount || point.completed : null,
                  completed = completedValue ? " Task " + Math.round(completedValue * 1000) / 10 + "% completed." : "";
              return Highcharts.format("{point.yCategory}.{completed} Start {point.x:%Y-%m-%d}, end {point.x2:%Y-%m-%d}.", { point, completed });
          },
      },
      series: {
          descriptionFormatter: function (series:any) {
              return series.name;
          },
      },
  },

  lang: {
      accessibility: {
          axis: {
              xAxisDescriptionPlural: "The chart has a two-part X axis showing time in both week numbers and days.",
              yAxisDescriptionPlural: "The chart has one Y axis showing task categories.",
          },
      },
  },
  series: [
      {
          name: "",
          data: series,
      },
  ],
  }
  );

  useEffect(() => {
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      chart: {
        ...prevOptions.chart,
        height: height || 400, 
      },
    }));
  }, [height]);

  return (
    <HighchartsReact
      constructorType="ganttChart"
      highcharts={Highcharts}
      options={chartOptions}
    />
  );
};

export default GanttChart;
