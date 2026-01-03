/**
 * Generates unique node IDs for nodes of a given type.
 */
class NodeIdManager {
  private usedNodeNumbersByType: Map<string, Set<number>>;

  constructor() {
    this.usedNodeNumbersByType = new Map<string, Set<number>>();
  }

  generateNodeId(nodeTypeId: string): string {
    if (!this.usedNodeNumbersByType.has(nodeTypeId)) {
      this.usedNodeNumbersByType.set(nodeTypeId, new Set<number>());
    }

    const usedNumbers = this.usedNodeNumbersByType.get(nodeTypeId)!;
    let nodeNumber = 1;
    while (usedNumbers.has(nodeNumber)) {
      nodeNumber++;
    }
    usedNumbers.add(nodeNumber);

    return `${nodeTypeId}-${nodeNumber}`;
  }

  deleteNodeId(nodeId: string): void {
    const [nodeTypeId, nodeNumberStr] = nodeId.split("-");
    const nodeNumber = parseInt(nodeNumberStr, 10);

    if (this.usedNodeNumbersByType.has(nodeTypeId)) {
      const usedNumbers = this.usedNodeNumbersByType.get(nodeTypeId)!;
      usedNumbers.delete(nodeNumber);
    }
  }
}

export default NodeIdManager;
