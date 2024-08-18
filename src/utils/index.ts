import { RecursiveNode } from "@/types";

export const parseRecursiveData = (callData: any[]): RecursiveNode => {
    const nodeMap = new Map<number, RecursiveNode>();
    const rootNodes: RecursiveNode[] = [];
  
    callData.forEach(entry => {
      if (entry.type === 'call') {
        nodeMap.set(entry.id, {
          id: entry.id,
          name: entry.name,
          children: [],
        });
      } else if (entry.type === 'return') {
        const node = nodeMap.get(entry.id);
        if (node) {
          node.value = entry.result;
        }
      }
    });
  
    callData.forEach(entry => {
      if (entry.type === 'call') {
        const node = nodeMap.get(entry.id);
        if (node) {
          // Find parent node by id
          const parentNode = nodeMap.get(entry.id - 1); // Điều chỉnh logic nếu cần
          if (parentNode) {
            parentNode.children?.push(node);
          } else {
            rootNodes.push(node); // Trường hợp nút gốc
          }
        }
      }
    });
  
    return rootNodes[0] || { id: 0, name: 'root', children: [] }; // Trả về nút gốc
  };
  