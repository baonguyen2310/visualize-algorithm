import React, { useEffect, useRef } from 'react';
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
  const nodes: { id: number; name: string; x?: number; y?: number; symbolSize: number; label: { show: boolean; formatter: string }; itemStyle: { color: string } }[] = [];
  const links = [];

  const uniqueNodes = new Map<number, { name: string; type: string }>();
  const nodeLevels = new Map<number, number>(); // Map node ID to its level in the tree
  const nodePositions = new Map<number, { x: number; y: number }>();

  const queue = [{ id: 0, level: 0, x: 0, y: 0 }]; // Start with root node
  nodeLevels.set(0, 0);
  nodePositions.set(0, { x: 0, y: 0 });

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    const { id, level, x, y } = current;
    const childNodes = data.filter(item => item.callerId === id);

    childNodes.forEach((item, index) => {
      const childX = x + (index - childNodes.length / 2) * 100; // Spread children horizontally
      const childY = y + 100; // Move children down one level

      queue.push({ id: item.id, level: level + 1, x: childX, y: childY });
      nodeLevels.set(item.id, level + 1);
      nodePositions.set(item.id, { x: childX, y: childY });

      if (item.callerId !== null) {
        links.push({
          source: item.callerId,
          target: item.id
        });
      }
    });
  }

  data.forEach(item => {
    const { id, type } = item;
    const pos = nodePositions.get(id);

    if (pos) {
      nodes.push({
        id,
        name: `f(${item.n}) = ${item.result}`,
        x: pos.x,
        y: pos.y,
        symbolSize: 50,
        label: {
          show: true,
          formatter: `{b}`
        },
        itemStyle: {
          color: type === 'call' ? 'blue' : 'green'
        }
      });
    }
  });

  return { nodes, links };
};

const RecursiveTreeChart: React.FC<RecursiveTreeChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.length > 0 && chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const { nodes, links } = parseRecursiveData(data);

      chart.setOption({
        tooltip: {},
        legend: [{
          data: ['Call', 'Return']
        }],
        series: [{
          type: 'graph',
          layout: 'none', // Use 'none' to allow manual positioning
          symbolSize: 50,
          roam: true,
          label: {
            position: 'right'
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          data: nodes,
          links: links,
          lineStyle: {
            color: 'source',
            curveness: 0.3
          }
        }]
      });

      return () => {
        chart.dispose();
      };
    }
  }, [data]);

  return (
    <div ref={chartRef} style={{ width: '100%', height: '600px' }}></div>
  );
};

export default RecursiveTreeChart;
