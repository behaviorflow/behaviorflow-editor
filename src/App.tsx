import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Connection,
  NodeToolbar,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import BehaviorFlowNode from './nodes/BehaviorFlowNode';
import StartNode from './nodes/StartNode';
import TerminalNode from './nodes/TerminalNode';
import './nodes/behavior-flow-node.css'; 

import Sidebar from './components/Sidebar';

const rfStyle = {
  backgroundColor: '#cccccc',
};

const initialNodes = [
  {
    id: 'start',
    type: 'startNode',
    position: {x: 0, y: 0},
    draggable: false
  },
  {
    id: 'node-1',
    type: 'behaviorFlowNode',
    position: { x: 100, y: -50 },
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
  {
    id: 'failure',
    type: 'terminalNode',
    position: {x: 400, y: 20 },
    data: {
      label: 'Failure'
    }
  },
  {
    id: 'success',
    type: 'terminalNode',
    position:  {x: 400, y: -50 },
    data: {
      label: 'Success'
    }
  }
];
const nodeTypes = { behaviorFlowNode: BehaviorFlowNode, startNode: StartNode, terminalNode: TerminalNode };

const connectionLineStyle = {
  stroke: "#00254d",
  strokeWidth: 1.5
};

// const onConnectStart = useCallback(

// )

// const initialNodes = [
//   { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
//   { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
// ];
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
const initialEdges = [];

// import { initialNodes, nodeTypes } from './nodes';

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback(
    (connection: Edge | Connection) => setEdges((edges) => addEdge(
      {
        ...connection,
        style: connectionLineStyle
      },
      edges
      )),
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
        connectionLineStyle={connectionLineStyle}
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

//        <Sidebar />