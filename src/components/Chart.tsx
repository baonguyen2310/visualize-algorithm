'use client'

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const Chart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

      const option = {
        title: {
          text: 'Biểu Đồ Đơn Giản'
        },
        tooltip: {},
        legend: {
          data: ['Dữ Liệu']
        },
        xAxis: {
          data: ['A', 'B', 'C', 'D', 'E']
        },
        yAxis: {},
        series: [{
          name: 'Dữ Liệu',
          type: 'bar', // Loại biểu đồ: 'bar' cho biểu đồ cột
          data: [5, 20, 36, 10, 10]
        }]
      };

      chart.setOption(option);

      // Cleanup on unmount
      return () => {
        chart.dispose();
      };
    }
  }, []);

  return <div ref={chartRef} style={{ width: '600px', height: '400px' }} />;
};

export default Chart;
