import React from 'react';
import RecursiveTreeChart from '@/components/RecursiveTreeChart';

const nodes = [
  { id: '1', label: 'Root', x: 300, y: 300 },
  { id: '2', label: 'Child 1', x: 200, y: 200 },
  { id: '3', label: 'Child 2', x: 400, y: 200 },
  { id: '4', label: 'Grandchild 1', x: 150, y: 100 },
  { id: '5', label: 'Grandchild 2', x: 250, y: 100 }
];

const edges = [
  { source: '1', target: '2' },
  { source: '1', target: '3' },
  { source: '2', target: '4' },
  { source: '2', target: '5' }
];

const App: React.FC = () => {
  return (
    <div>
      <h1>Visualization of Recursive Tree</h1>
      <RecursiveTreeChart nodes={nodes} edges={edges} />
    </div>
  );
};

export default App;
