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
