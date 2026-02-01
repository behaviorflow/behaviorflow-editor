export interface GraphNodeTypeDTO {
  node_type_id: string;
  result_ids: string[];
}

export interface GraphNodeDTO {
  node_id: string;
  node_type: string;
  transitions: Record<string, string>;
}

export interface GraphDTO {
  node_types: GraphNodeTypeDTO[];
  nodes: GraphNodeDTO[];
  start_node_id: string | null;
}