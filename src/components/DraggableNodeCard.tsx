import React from 'react';
import { GripVertical } from 'lucide-react';

function DraggableNodeCard( {nodeName} ) {
	return (
		<div className="flex items-center">
			<GripVertical className="w-4 h-4 text-gray-400" />
			<span className="text-gray-700 font-medum text-sm">
				{nodeName}
			</span>
		</div>
	);
}

export default DraggableNodeCard;

