import React, { useCallback, useEffect, useRef, useMemo } from "react";
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from "reactflow";
import dagre from "dagre";

import CustomNodeTest from "./myCustomNode";

import "reactflow/dist/style.css";

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

function generateGraph(data, selectAction, isSelectable) {
  const { employees, departments } = data;

  const nodes = [];
  const edges = [];
  const depsIds = [];

  for (let item of departments) {
    const level = item.path
      .split("/")
      .slice(0, item.path.split("/").length - 1).length;
    const childs = employees.filter((el) => item.workers.includes(el.id));
    const depId = level + "--" + create_UUID();

    depsIds.push(depId);

    nodes.push({
      id: depId,
      position: { x: 0, y: 0 },
      data: {
        name: item.name,
        head: item.head_name,
        headId: item.headId,
        childs: item.workers,
        id: item.id,
        type: "radio",
        action: selectAction,
        isSelectable: isSelectable
      },
      type: "customNode",
    });

    childs.forEach((el, index) => {
      if (!departments.map((el) => el.headId).includes(el.id)) {
        console.log(el)
        nodes.push({
          id: depId + "--" + index,
          position: { x: 0, y: 0 },
          data: { 
            name: el.name,
            head: el.position,
            type: "default" 
          },
          type: "customNode",
        });

        edges.push({
          id: create_UUID(),
          source: depId,
          target: depId + "--" + index,
          animated: false,
        });
      }
    });
  }

  for (let current of nodes) {
    if (current?.data?.childs?.length) {
      console.log("dep found");
      for (let node of nodes) {
        if (
          node.id.split("--").length === 2 &&
          current.data.childs.includes(node.data.headId)
        ) {
          edges.push({
            id: create_UUID(),
            source: current.id,
            target: node.id,
            animated: false,
          });
        }
      }
    }
  }

  return { nodes, edges };
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

// graph direction options
// TB - top to bottom
// BT - bottom to top
// LR - left to right
// RL - right to left

const LayoutFlow = ({ data, handleSelectDataFromTree, isSelectable }) => {
  // const nodeTypes = {
  //   customNode: CustomNodeTest,
  // };

  const nodeTypes = useMemo(() => ({ customNode: CustomNodeTest }), []);

  const direction = "LR";
  const { nodes: initialNodes, edges: initialEdges } = generateGraph(data, handleSelectDataFromTree, isSelectable);

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges,
    direction
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds
        )
      ),
    []
  );

  const reactFlowWrapper = useRef(null);
  const reactFlow = useRef(null);

  useEffect(() => {
    console.log("Use effect");

    // Вызывается при изменении размеров контейнера
    const handleResize = () => {
      console.log(reactFlow.current.instance);
      if (reactFlow.current && reactFlow.current.instance) {
        reactFlow.current.instance.fitView();
        console.log("Flow");
      }
    };

    // Добавляем слушатель события изменения размера окна
    reactFlow.current.addEventListener("resize", handleResize);

    // Очистка слушателя события при размонтировании компонента
    return () => {
      reactFlow?.current?.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="react-flow-container" ref={reactFlowWrapper}>
      <div style={{ width: "100%", height: "100%" }}>
        <ReactFlow
          elementsSelectable={false}
          nodes={nodes}
          edges={edges}
          elements={nodes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodesDraggable={false}
          connectionLineType={ConnectionLineType.SimpleBezier}
          fitView
          ref={reactFlow}
          nodeTypes={nodeTypes}
        >
          {/* <Controls position="top-left" /> */}
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default LayoutFlow;
