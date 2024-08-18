'use client'

import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

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

const parseRecursiveData = (data: RecursiveNode[]) => {
  const nodes = new Map<number, { id: number; name: string; type: string }>();
  const edges: { data: { source: string; target: string } }[] = [];
  
  // Tạo map lưu các node theo id để truy cập dễ dàng
  const nodeMap = new Map<number, { name: string; type: string }>();

  data.forEach(item => {
    const nodeName = `f(${item.n}) = ${item.result}`;
    nodeMap.set(item.id, { name: nodeName, type: item.type });

    // Thêm node vào danh sách node
    nodes.set(item.id, { id: item.id, name: nodeName, type: item.type });
  });

  const relationNode: { id: string; callerId: string; }[] = []

  data.forEach(item => {
    if (item.callerId != null) {
      if (item.type === "call") {
        relationNode.push({
          id: item.id.toString(),
          callerId: item.callerId.toString()
        })
      }
    }
  })

  data.forEach(item => {
    if (item.callerId !== null) {
      // Nếu node là 'return', tạo một cạnh từ node hiện tại đến node gọi
      if (item.type === 'return') {
        const callerId = relationNode.find(x => x.id === item.id.toString())?.callerId

        // edges.push({
        //   data: {
        //     source: item.id.toString(),    // Node 'return'
        //     target: callerId // Node gọi (cha)
        //   }
        // });
      } else if (item.id !== item.callerId) {
        // Nếu node không phải 'return', tạo một cạnh từ callerId đến id của node
        edges.push({
          data: {
            source: item.callerId.toString(), // Node gọi (cha)
            target: item.id.toString()       // Node hiện tại
          }
        });
      }
    }
  });

  return { nodes: Array.from(nodes.values()), edges };
};



// Component hiển thị biểu đồ cây
const RecursiveTreeChart: React.FC<RecursiveTreeChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.length > 0 && chartRef.current) {
      // Đăng ký bố cục dagre với Cytoscape
      cytoscape.use(dagre);

      const { nodes, edges } = parseRecursiveData(data);

      // Khởi tạo đối tượng Cytoscape
      const cy = cytoscape({
        container: chartRef.current!,
        elements: [
          ...nodes.map(node => ({
            data: { id: node.id.toString(), label: node.name, type: node.type }
          })),
          ...edges
        ],
        layout: {
          name: 'dagre', // Sử dụng bố cục 'dagre' cho đồ thị có hướng
          directed: true,
          padding: 10
        },
        style: [
          {
            selector: 'node',
            style: {
              'background-color': (node) => node.data('type') === 'call' ? 'blue' : 'green',
              'label': 'data(label)',
              'color': 'black',
              'width': '40px',
              'height': '40px'
            }
          },
          {
            selector: 'edge',
            style: {
              'line-color': 'black',
              'target-arrow-color': 'black',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier'
            }
          }
        ]
      });

      // Đảm bảo node gốc nằm ở đỉnh cao nhất
      const rootNodeId = 0;
      const rootNode = cy.getElementById(rootNodeId.toString());
      if (rootNode.length > 0) {
        rootNode.move({
          parent: undefined, // Đảm bảo node gốc không bị gán làm con của bất kỳ node nào
        });
      }

      // Dọn dẹp Cytoscape khi component bị gỡ bỏ
      return () => {
        cy.destroy();
      };
    }
  }, [data]);

  return (
    <div ref={chartRef} style={{ width: '100%', height: '600px' }}></div>
  );
};

export default RecursiveTreeChart;
