import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre); // Register the dagre layout

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
  const nodes = new Map<number, { id: number; name: string; type: string }>();
  const edges: { data: { source: string; target: string } }[] = [];
  
  const callChildren = new Map<number, number[]>(); // Lưu danh sách con cho mỗi node gọi

  data.forEach(item => {
    const nodeName = `f(${item.n}) = ${item.result}`;
    
    if (item.type === 'call') {
      nodes.set(item.id, { id: item.id, name: nodeName, type: 'call' });

      if (item.callerId !== null) {
        if (!callChildren.has(item.callerId)) {
          callChildren.set(item.callerId, []);
        }
        callChildren.get(item.callerId)?.push(item.id);
      }
    }
  });

  data.forEach(item => {
    if (item.type === 'call' && item.callerId !== null && item.id !== item.callerId) {
      edges.push({
        data: {
          source: item.callerId.toString(),
          target: item.id.toString()
        }
      });
    }
  });

  data.forEach(item => {
    if (item.type === 'return' && item.callerId !== null) {
      const parent = Array.from(callChildren.entries()).find(([key, children]) => children.includes(item.id));
      if (parent) {
        const [parentId] = parent;
        edges.push({
          data: {
            source: item.id.toString(),
            target: parentId.toString()
          }
        });
      }
    }
  });

  // Đảm bảo rằng tất cả các node có id hợp lệ
  const formattedNodes = Array.from(nodes.values()).map(node => ({
    data: {
      id: node.id.toString(),
      label: node.name,
      type: node.type
    }
  }));

  // Kiểm tra và loại bỏ các edge không hợp lệ
  const validEdges = edges.filter(edge => {
    return formattedNodes.some(node => node.data.id === edge.data.source) &&
           formattedNodes.some(node => node.data.id === edge.data.target);
  });

  return { nodes: formattedNodes, edges: validEdges };
};

const RecursiveTreeChart: React.FC<RecursiveTreeChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.length > 0 && chartRef.current) {
      const { nodes, edges } = parseRecursiveData(data);

      const cy = cytoscape({
        container: chartRef.current,
        elements: [
          ...nodes,
          ...edges
        ],
        layout: {
          name: 'dagre'
        },
        style: [
          {
            selector: 'node',
            style: {
              'background-color': 'data(type === "call" ? "blue" : "green")',
              'label': 'data(label)',
              'opacity': 0 // Initially hide nodes
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2,
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'opacity': 0 // Initially hide edges
            }
          }
        ]
      });

      // Animation logic with delay
      const delay = 200; // Time in milliseconds between animations
      const duration = 200; // Duration of each animation

      const animateGraph = () => {
        const nodes = cy.nodes();
        const edges = cy.edges();

        let index = 0;
        const showNextElement = () => {
          if (index < nodes.length) {
            setTimeout(() => {
              nodes[index].animate({ style: { 'opacity': 1 } }, { duration });
              index++;
              showNextElement();
            }, index * delay);
          } else if (index < nodes.length + edges.length) {
            setTimeout(() => {
              edges[index - nodes.length].animate({ style: { 'opacity': 1 } }, { duration });
              index++;
              showNextElement();
            }, (index - nodes.length) * delay);
          }
        };

        showNextElement();
      };

      // Start animation
      animateGraph();

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
