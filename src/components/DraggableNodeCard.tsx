import React from 'react';
import { GripVertical } from 'lucide-react';

export default function DraggableNodeCard( {nodeName} ) {
	return (
		<div style={{padding: '0.13em'}}>
			<div style={{display: 'flex', alignItems: 'center', backgroundColor: 'gold', padding: '0.14em', border: '0.15em solid', borderColor: 'black', borderRadius: '0.85em'}}>
				<GripVertical style={{width: '1.6em', height: '1.6em', color: 'gray', verticalAlign: 'middle'}} />
				<span style={{fontWeight: 'medium', fontSize: '1.3em', paddingLeft: '0.1em', verticalAlign: 'middle'}}>
					{nodeName}
				</span>
			</div>
		</div>
	);
}

