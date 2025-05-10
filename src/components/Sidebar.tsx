import React from 'react';

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  const nodes = [
    { id: 'node-1', label: 'Node 1', type: 'default' },
    { id: 'node-2', label: 'Node 2', type: 'input' },
    { id: 'node-3', label: 'Node 3', type: 'output' },
  ];

  return (
    <div
      style={{
        width: '250px',
        height: '100vh',
        backgroundColor: '#f7f7f7',
        borderRight: '1px solid #ddd',
        padding: '10px',
      }}
    >
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Sidebar</h3>
      {nodes.map((node) => (
        <div
          key={node.id}
          draggable
          onDragStart={(event) => onDragStart(event, node.type)}
          style={{
            padding: '10px 20px',
            margin: '10px 0',
            backgroundColor: '#007bff',
            color: '#fff',
            borderRadius: '5px',
            cursor: 'grab',
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          {node.label}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
