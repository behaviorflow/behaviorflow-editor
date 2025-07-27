import React, { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Connection,
  useReactFlow,
  NodeToolbar,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import BehaviorFlowNode from './nodes/BehaviorFlowNode';
import StartNode from './nodes/StartNode';
import TerminalNode from './nodes/TerminalNode';
import './nodes/behavior-flow-node.css'; 

import NodePalette from './components/NodePalette';
import { NodeParam, BfNodeAttributes } from './types';

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
 
const initialEdges = [];

function FlowContent({ nodeAttributes }) {
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

  const insertNode = useCallback(
    (nodeAttributes: BfNodeAttributes, position: { x: number; y: number }) => {
      const newNode = {
        id: nodeAttributes.nodeName, // This should be unique. is the nodeName the nodeTypeId or the nodeId? Should be consistent on naming.
        type: 'behaviorFlowNode', // revisit if needed
        position,
        data: nodeAttributes,
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const { screenToFlowPosition } = useReactFlow();

const handleDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy'; // This changes the cursor to a copy cursor
  // You can also use 'move' for a different cursor
};

  const handleDrop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('application/json');
    
    if (data) {
      try {
        const nodeAttributes = JSON.parse(data);
        if (nodeAttributes && nodeAttributes.nodeName) {
          const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          });
          
          insertNode(nodeAttributes, position);
        }
      } catch (e) {
        console.error('Exception on drop:', e);
      }
    }
  };
 
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <div>
        <NodePalette nodes={nodeAttributes} />
      </div>
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionLineStyle={connectionLineStyle}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          fitView
          style={{backgroundColor: '#cccccc', width: '100%', height: '100%'}}
        >
          <Controls />
          <MiniMap />
          <Background color="#666666" variant="dots" gap={15} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}


export default function App() {
  const nodeAttributes : BfNodeAttributes[] = [
    {
      nodeName: "Do Thing",
      nodeType: "type",
      inParams: [],
      outParams: [],
      outPorts: ["Success", "Fail"]
    },
    {
      nodeName: "Check Thing",
      nodeType: "type2",
      inParams: [],
      outParams: [],
      outPorts: ["Success", "Fail"]
    },
    {
      nodeName: "Move to Charger",
      nodeType: "type3",
      inParams: [],
      outParams: [],
      outPorts: ["Success", "Fail"]
    },
  ]
 
  return (
    <ReactFlowProvider>
      <FlowContent nodeAttributes={nodeAttributes} />
    </ReactFlowProvider>
  );
}

//        <Sidebar />