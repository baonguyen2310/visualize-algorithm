'use client'

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Định nghĩa kiểu dữ liệu cho các node trong cây
interface RecursiveNode {
  id: number;
  callerId: number | null;
  n: number;
  type: 'call' | 'return';
  result: number;
}

// Định nghĩa kiểu dữ liệu cho props của biểu đồ
interface RecursiveTreeChartProps {
  data: RecursiveNode[];
}

// Hàm phân tích dữ liệu và chuyển đổi thành định dạng phù hợp cho D3
const parseRecursiveData = (data: RecursiveNode[]) => {
  const nodes = new Map<number, { id: number; name: string; type: string }>();
  const links: { source: number; target: number }[] = [];
  
  data.forEach(item => {
    // Tạo tên node dựa trên thông tin của item
    const nodeName = `f(${item.n}) = ${item.result}`;
    nodes.set(item.id, { id: item.id, name: nodeName, type: item.type });

    // Tạo liên kết giữa các node nếu có callerId
    if (item.callerId !== null) {
      links.push({
        source: item.callerId,
        target: item.id
      });
    }
  });

  // Chuyển đổi nodes từ Map thành mảng
  return { nodes: Array.from(nodes.values()), links };
};

// Component hiển thị biểu đồ cây
const RecursiveTreeChart: React.FC<RecursiveTreeChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.length > 0 && chartRef.current) {
      const { nodes, links } = parseRecursiveData(data);

      // Tạo đối tượng SVG để vẽ biểu đồ
      const svg = d3.select(chartRef.current)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%');

      const width = svg.node()!.clientWidth;
      const height = svg.node()!.clientHeight;

      // Tạo mô phỏng lực cho biểu đồ
      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id((d: any) => d.id))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2));

      // Vẽ các liên kết giữa các node
      const link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('stroke-width', 2)
        .attr('stroke', d => d.source.type === 'call' ? 'blue' : 'green');

      // Vẽ các node và thêm khả năng kéo thả
      const node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', 10)
        .attr('fill', d => d.type === 'call' ? 'blue' : 'green')
        .call(d3.drag()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }));

      // Thêm tiêu đề cho các node
      node.append('title')
        .text(d => d.name);

      // Cập nhật vị trí của các liên kết và node khi mô phỏng diễn ra
      simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
      });

      // Dọn dẹp SVG khi component bị gỡ bỏ
      return () => {
        svg.selectAll('*').remove();
      };
    }
  }, [data]);

  return (
    <div ref={chartRef} style={{ width: '100%', height: '600px' }}></div>
  );
};

export default RecursiveTreeChart;
