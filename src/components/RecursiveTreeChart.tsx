'use client'

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Node, Edge } from '@/types';

interface RecursiveTreeChartProps {
  nodes: Node[];
  edges: Edge[];
}

const RecursiveTreeChart: React.FC<RecursiveTreeChartProps> = ({ nodes, edges }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

      const option: echarts.EChartsOption = {
        tooltip: {},
        series: [
          {
            type: 'graph',
            layout: 'none',
            symbolSize: 50,
            roam: true,
            label: {
              show: true,
              position: 'right'
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            data: nodes.map(node => ({
              id: node.id,
              name: node.label,
              x: node.x,
              y: node.y
            })),
            edges: edges.map(edge => ({
              source: edge.source,
              target: edge.target,
              lineStyle: {
                color: '#000'
              }
            }))
          }
        ]
      };

      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    }
  }, [nodes, edges]);

  return <div ref={chartRef} style={{ width: '800px', height: '600px' }} />;
};

export default RecursiveTreeChart;
