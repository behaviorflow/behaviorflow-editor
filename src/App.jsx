import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeToolbar,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import BehaviorFlowNode from './nodes/BehaviorFlowNode';
import './nodes/behavior-flow-node.css'; 

const rfStyle = {
  backgroundColor: '#252732',
};

const initialNodes = [
  {
    id: 'node-1',
    type: 'behaviorFlow',
    position: { x: 0, y: 0 },
    data: { 
      nodeName: 'Move to Charger',
      nodeType: 'Move to Position',
      inParams: [ 
        { paramName: 'Target Pose'}, 
        { paramName: 'Speed'},
      ],
      outParams: [ 
        { paramName: 'Recovery Count'},  
      ],
      outPorts: [ 'Success', 'Failure'],
    },
  },
];
const nodeTypes = { behaviorFlow: BehaviorFlowNode };

// const initialNodes = [
//   { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
//   { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
// ];
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
const initialEdges = [];

// import { initialNodes, nodeTypes } from './nodes';

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges],
  );
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={rfStyle}
      >
        <Controls />
        <MiniMap />
        <Background color="#666666" variant="dots" gap={15} size={1} />
      </ReactFlow>
    </div>
  );
}