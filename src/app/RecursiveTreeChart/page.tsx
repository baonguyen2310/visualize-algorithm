'use client'

import React, { useEffect, useRef } from 'react';
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

  const evalRef = useRef<HTMLDivElement>(null);

  let callCount = 0;

  function fibonacci(n) {
    callCount++;
    console.log(`Call #${callCount}: fibonacci(${n})`);
    if (n <= 1) {
      console.log(`Return #${callCount}: ${n}`);
      return n;
    }
    const result = fibonacci(n - 1) + fibonacci(n - 2);
    console.log(`Return #${callCount}: ${result}`);
    return result;
  }

  console.log("Result:", fibonacci(4));  // Gọi hàm fibonacci để kiểm tra trace


  function handleClick1 () {
    const code = `
    function fibonacci(n) {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    }
    `;

    const fibonacci = eval(`(${code})`);
    const result = fibonacci(4);
    if (evalRef.current) evalRef.current.innerHTML = result;
  }

  function handleClick2 () {
    let userInput = "2+4";
    let result = Function("return " + userInput)(); // which is same as "return 2+4"
    if (evalRef.current) evalRef.current.innerHTML = result;
  }

  return (
    <div>
      <h1>Visualization of Recursive Tree</h1>
      <h2 ref={evalRef}>Eval Result</h2>
      <button onClick={handleClick1}>Eval</button>
      <button onClick={handleClick2}>New Function</button>
      <RecursiveTreeChart nodes={nodes} edges={edges} />
    </div>
  );
};

export default App;
