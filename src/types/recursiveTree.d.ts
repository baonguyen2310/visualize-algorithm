export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface Edge {
  source: string;
  target: string;
}

export interface RecursiveNode {
  id: number;
  name: string;
  value?: number;
  children?: RecursiveNode[];
}

export interface RecursiveTree {
  root: RecursiveNode;
}
