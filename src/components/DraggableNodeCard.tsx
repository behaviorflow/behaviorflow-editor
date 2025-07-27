import React from 'react';
import { GripVertical } from 'lucide-react';

export default function DraggableNodeCard({ nodeName, nodeAttributes }) {
	const handleDragStart = (e) => {
		e.dataTransfer.setData('application/json', JSON.stringify(nodeAttributes));
		e.currentTarget.style.cursor = 'grabbing';
	};
	// onMouseDown={(e) => {e.currentTarget.style.cursor = 'grabbing';}}
	return (
		<div style={{ padding: '0.13em', cursor: 'grab' }} draggable={true} onDragStart={handleDragStart} onMouseUp={(e) => { e.currentTarget.style.cursor = 'grab';}} onDragEnd={(e) => { e.currentTarget.style.cursor = 'grab';}} >
			<div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'gold', padding: '0.14em', border: '0.15em solid', borderColor: 'black', borderRadius: '0.85em' }}>
				<GripVertical style={{ width: '1.6em', height: '1.6em', color: 'gray', verticalAlign: 'middle' }} />
				<span style={{ fontWeight: 'medium', fontSize: '1.3em', paddingLeft: '0.1em', verticalAlign: 'middle' }}>
					{nodeName}
				</span>
			</div>
		</div>
	);
}

