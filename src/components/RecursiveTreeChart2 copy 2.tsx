'use client'

import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

interface RecursiveNode {
  id: number;
  callerId: number | null;
  n: number;
  type: 'call' | 'return';
  result: number;
}

interface RecursiveTreeChartProps {
  data: RecursiveNode[];
}

const parseRecursiveData = (data: RecursiveNode[]) => {
  const nodes: { id: number; name: string; symbolSize: number; label: { show: boolean; formatter: string; }; itemStyle: { color: string; }; }[] = [];
  const links: { source: number; target: number; }[] = [];
  
  const uniqueNodes = new Map<number, { name: string; type: string }>();

  data.forEach(item => {
    const nodeName = `f(${item.n}) = ${item.result}`;
    
    uniqueNodes.set(item.id, {
      name: nodeName,
      type: item.type
    });

    if (item.callerId !== null) {
      links.push({
        source: item.callerId,
        target: item.id
      });
    }
  });

  uniqueNodes.forEach((value, key) => {
    nodes.push({
      id: key,
      name: value.name,
      symbolSize: 10,
      label: {
        show: true,
        formatter: `{b}`
      },
      itemStyle: {
        color: value.type === 'call' ? 'blue' : 'green'
      }
    });
  });

  return { nodes, links };
};

const RecursiveTreeChart: React.FC<RecursiveTreeChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentData, setCurrentData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });

  useEffect(() => {
    if (data.length > 0 && chartRef.current) {
      const chart = echarts.init(chartRef.current);

      const { nodes, links } = parseRecursiveData(data);

      const updateChart = () => {
        if (currentIndex < nodes.length) {
          setCurrentData(prevData => ({
            nodes: [...prevData.nodes, nodes[currentIndex]],
            links: [...prevData.links, ...links.filter(link => link.target === nodes[currentIndex].id)]
          }));
          setCurrentIndex(prevIndex => prevIndex + 1);
        }
      };

      const interval = setInterval(updateChart, 1000);

      chart.setOption({
        tooltip: {},
        legend: [{
          data: ['Call', 'Return']
        }],
        series: [{
          type: 'graph',
          layout: 'force',
          symbolSize: 50,
          roam: true,
          label: {
            position: 'right'
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          data: currentData.nodes,
          links: currentData.links,
          lineStyle: {
            color: 'source',
            curveness: 0.3
          }
        }]
      });

      return () => {
        clearInterval(interval);
        chart.dispose();
      };
    }
  }, [data, currentData, currentIndex]);

  return (
    <div ref={chartRef} style={{ width: '100%', height: '600px' }}></div>
  );
};

export default RecursiveTreeChart;
