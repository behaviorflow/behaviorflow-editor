import React from 'react';
import DraggableNodeCard from './DraggableNodeCard'
import { BfNodeAttributes } from '../types';

interface NodePaletteProps {
//   onDragEnd: (event: React.DragEvent, nodeAttributes: BfNodeAttributes) => void;
  nodes: BfNodeAttributes[];
}

export default function NodePalette( { nodes } : NodePaletteProps ) {
    return (
        <div style={{ width: '300px', height: '100vh', backgroundColor: '#f7f7f7', borderRight: '1px solid #ddd', padding: '10px'}}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Node Palette</h3>
            {nodes.map((node) => (
                <div key={node.nodeName} style={{ textAlign: 'left' }}>
                    <DraggableNodeCard nodeName={node.nodeName}/>
                </div>
            ))}
        </div>
    );
}