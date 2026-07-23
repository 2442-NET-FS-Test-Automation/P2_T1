import React from 'react';
import ReactECharts from 'echarts-for-react';

interface WeeklyMilesProps {
  // Datos que vienen del backend para los 7 días de la semana actual
  milesData: number[]; // Ej: [1.2, 0, 3.5, 2.0, 0, 4.1, 1.5]
}

export const WeeklyMilesChart: React.FC<WeeklyMilesProps> = ({ milesData }) => {
  const option = {
    title: {
      text: 'Millas Recorridas (Esta Semana)',
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
      data: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      axisLine: { lineStyle: { color: '#888' } }
    },
    yAxis: {
      type: 'value',
      name: 'Millas',
      splitLine: { lineStyle: { color: '#333' } },
      axisLine: { lineStyle: { color: '#888' } }
    },
    series: [
      {
        name: 'Millas',
        type: 'bar',
        data: milesData,
        barWidth: '40%',
        itemStyle: {
          // Gradiente moderno de color verde/turquesa a azul
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