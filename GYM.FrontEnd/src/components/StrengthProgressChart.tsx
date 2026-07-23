import React from 'react';
import ReactECharts from 'echarts-for-react';

interface StrengthProgressProps {
  dates: string[];       // Ej: ['01 Jul', '05 Jul', '10 Jul', '15 Jul', '20 Jul']
  strengthValues: number[]; // Ej: [100, 115, 135, 155, 185]
}

export const StrengthProgressChart: React.FC<StrengthProgressProps> = ({ dates, strengthValues }) => {
  const option = {
    title: {
      text: 'Progreso de Fuerza Total',
      left: 'center',
      textStyle: { color: '#ffffff', fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      formatter: 'Puntos de Fuerza: {c} pts'
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#888' } }
    },
    yAxis: {
      type: 'value',
      name: 'Pts Fuerza',
      splitLine: { lineStyle: { color: '#333' } },
      axisLine: { lineStyle: { color: '#888' } }
    },
    series: [
      {
        name: 'Fuerza',
        type: 'line',
        smooth: true, // Línea curva suave
        data: strengthValues,
        symbolSize: 8,
        lineStyle: { color: '#FF007F', width: 3 },
        itemStyle: { color: '#FF007F' },
        // Área sombreada bajo la curva
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 0, 127, 0.5)' },
              { offset: 1, color: 'rgba(255, 0, 127, 0.0)' }
            ]
          }
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '300px', width: '100%' }} />;
};