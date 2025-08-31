import { useState } from "react";
import Sidebar from "../../ui/Sidebar/Sidebar";
import NodePalette, { NodePaletteProps } from "../../NodePalette/NodePalette";

export default function NodePaletteSidebar({ nodes }: NodePaletteProps) {
  return (
    <div>
      <Sidebar title="Node Pallette">
        <NodePalette nodes={nodes} />
      </Sidebar>
    </div>
  );
}
