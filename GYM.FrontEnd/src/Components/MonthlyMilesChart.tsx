import React from 'react';
import ReactECharts from 'echarts-for-react';

interface MonthlyMilesProps {
  milesData: number[];   // un valor por cada día del mes seleccionado
  dayLabels: string[];   // ['1', '2', '3', ..., '31'] según el mes
  monthLabel: string;    // ej. "March 2026" para el título
}

export const MonthlyMilesChart: React.FC<MonthlyMilesProps> = ({ milesData, dayLabels, monthLabel }) => {
  const option = {
    title: {
      text: `Miles runned (${monthLabel})`,
      left: 'center',
      textStyle: { color: '#ffffff', fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} mi'
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: dayLabels,
      axisLine: { lineStyle: { color: '#888' } }
    },
    yAxis: {
      type: 'value',
      name: 'Miles',
      splitLine: { lineStyle: { color: '#333' } },
      axisLine: { lineStyle: { color: '#888' } }
    },
    series: [
      {
        name: 'Miles',
        type: 'bar',
        data: milesData,
        barWidth: '60%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#00F2FE' },
              { offset: 1, color: '#4FACFE' }
            ]
          },
          borderRadius: [6, 6, 0, 0]
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '300px', width: '100%' }} />;
};