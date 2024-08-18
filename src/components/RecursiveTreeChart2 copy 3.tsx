'use client'

import React from 'react';

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

const RecursiveTreeChart: React.FC<RecursiveTreeChartProps> = ({ data }) => {
  // Tạo một bản đồ để lưu vị trí của các nút
  const nodePositions = new Map<number, { x: number; y: number }>();

  // Ví dụ: Phân bố các nút theo dạng lưới đơn giản (cần cải thiện cho các trường hợp phức tạp hơn)
  let x = 50;
  let y = 50;
  const spacing = 150;

  data.forEach((node, index) => {
    nodePositions.set(node.id, { x, y });
    x += spacing;
    if ((index + 1) % 5 === 0) {
      x = 50;
      y += spacing;
    }
  });

  return (
    <svg width="100%" height="600" style={{ border: '1px solid black' }}>
      {/* Vẽ các liên kết */}
      {data.filter(node => node.callerId !== null).map(node => {
        const sourcePos = nodePositions.get(node.callerId!);
        const targetPos = nodePositions.get(node.id);
        if (sourcePos && targetPos) {
          return (
            <line
              key={`link-${node.callerId}-${node.id}`}
              x1={sourcePos.x}
              y1={sourcePos.y}
              x2={targetPos.x}
              y2={targetPos.y}
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
          );
        }
        return null;
      })}

      {/* Định nghĩa mũi tên cho các liên kết */}
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" fill="black">
          <path d="M 0 0 L 10 3 L 0 6 L 3 3 Z" />
        </marker>
      </defs>

      {/* Vẽ các nút */}
      {data.map(node => {
        const pos = nodePositions.get(node.id);
        return (
          pos && (
            <React.Fragment key={node.id}>
              <circle cx={pos.x} cy={pos.y} r="20" fill={node.type === 'call' ? 'blue' : 'green'} />
              <text x={pos.x} y={pos.y} fill="white" textAnchor="middle" dominantBaseline="central">
                f({node.n}) = {node.result}
              </text>
            </React.Fragment>
          )
        );
      })}
    </svg>
  );
};

export default RecursiveTreeChart;
