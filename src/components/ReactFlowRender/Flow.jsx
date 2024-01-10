import React, { useCallback } from "react";

import ReactFlow, {
  ConnectionMode,
  Background,
  useNodesState,
  useEdgesState,
  applyNodeChanges
} from "react-flow-renderer";
import CustomNode from "./CustomNode";

const nodeTypes = {
  custom: CustomNode
};
const onInit = (reactFlowInstance) => {
  reactFlowInstance.fitView();
};

const initialNodes = [
  {
    id: "1",
    type: "custom",
    data: { label: "Node 1" },
    position: { x: 250, y: 5 }
  },
  {
    id: "2",
    type: "custom",
    data: { label: "Node 2" },
    position: { x: 100, y: 100 }
  },
  {
    id: "3",
    type: "custom",
    data: { label: "Node 3" },
    position: { x: 400, y: 100 }
  },
  {
    id: "4",
    type: "custom",
    data: { label: "Node 4" },
    position: { x: 250, y: 250 }
  }
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    sourceHandle: "2",
    targetHandle: "1",
    animated: true
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    sourceHandle: "2",
    targetHandle: "1",
    markerEnd: {
      type: "arrow"
    }
  },
  {
    id: "e1-4",
    source: "4",
    target: "3",
    sourceHandle: "1",
    targetHandle: "2",
    markerEnd: {
      type: "arrow"
    }
  }
];

const BasicFlow = () => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  const handleNodesChange = useCallback(
    (changes) => {
      const nextNodes = applyNodeChanges(changes, nodes);
      setNodes(nextNodes);
    },
    [nodes]
  );
  return (
    <ReactFlow
      connectionMode={ConnectionMode.Loose}
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onInit={onInit}
      nodesDraggable
      onNodesChange={handleNodesChange}
    >
      <Background />
    </ReactFlow>
  );
};

export default BasicFlow;
