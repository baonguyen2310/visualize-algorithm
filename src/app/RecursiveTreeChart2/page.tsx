'use client'

import { useState } from 'react';
import RecursiveInput from '@/components/RecursiveInput';
import RecursiveTreeChart from '@/components/RecursiveTreeChart2';

interface RecursiveNode {
  id: number;
  callerId: number | null;
  n: number;
  type: 'call' | 'return';
  result: number;
}

export default function Page() {
  const [data, setData] = useState<RecursiveNode[]>([]);

  const handleSubmit = (result: { result: RecursiveNode[] }) => {
    setData(result.result);
  };

  return (
    <div>
      <RecursiveInput onSubmit={handleSubmit} />
      <RecursiveTreeChart data={data} />
    </div>
  );
}
