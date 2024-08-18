'use client'

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
  const nodes = [];
  const links = [];
  
  const uniqueNodes = new Map<number, { name: string; type: string; parentId: number | null }>();

  data.forEach(item => {
    const nodeName = `f(${item.n}) = ${item.result}`;
    
    uniqueNodes.set(item.id, {
      name: nodeName,
      type: item.type,
      parentId: item.callerId
    });
  });

  uniqueNodes.forEach((value, key) => {
    nodes.push({
      id: key,
      name: value.name,
      symbolSize: 50,
      label: {
        show: true,
        formatter: `{b}`
      },
      itemStyle: {
        color: value.type === 'call' ? 'blue' : 'green'
      }
    });
  });

  return { nodes, links: [] }; // Links are not used in tree layout
};

const RecursiveTreeChart: React.FC<RecursiveTreeChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.length > 0 && chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const { nodes } = parseRecursiveData(data);

      chart.setOption({
        tooltip: {},
        series: [{
          type: 'tree',
          data: [{
            name: 'Root',
            children: parseTreeData(nodes)
          }],
          top: '5%',
          left: '10%',
          bottom: '2%',
          right: '20%',
          symbolSize: 50,
          label: {
            position: 'left'
          },
          emphasis: {
            focus: 'descendant'
          },
          leaves: {
            label: {
              position: 'right'
            }
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750
        }]
      });

      return () => {
        chart.dispose();
      };
    }
  }, [data]);

  // Convert node data into a tree structure
  const parseTreeData = (nodes: any[]) => {
    const nodeMap = new Map<number, any>();
    const treeData: any[] = [];

    // Create a map of nodes with id as the key
    nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] });
    });

    // Build tree structure
    nodeMap.forEach(node => {
      if (node.parentId !== null && nodeMap.has(node.parentId)) {
        // If the node has a parentId, add it to the children of the parent node
        nodeMap.get(node.parentId).children.push(node);
      } else {
        // If there is no parentId, it is a root node
        treeData.push(node);
      }
    });

    return treeData;
  };

  return (
    <div ref={chartRef} style={{ width: '100%', height: '600px' }}></div>
  );
};

export default RecursiveTreeChart;
