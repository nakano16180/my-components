"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function CardNode({ data }: NodeProps) {
  return (
    <Card className="w-48 shadow-md">
      <Handle type="target" position={Position.Top} />
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-sm">{data.label as string}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <Badge variant="secondary" className="text-xs">
          {data.type as string}
        </Badge>
      </CardContent>
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
}

const nodeTypes = { card: CardNode };

const initialNodes: Node[] = [
  {
    id: "1",
    type: "card",
    position: { x: 250, y: 50 },
    data: { label: "Start", type: "input" },
  },
  {
    id: "2",
    type: "card",
    position: { x: 100, y: 200 },
    data: { label: "Process A", type: "process" },
  },
  {
    id: "3",
    type: "card",
    position: { x: 400, y: 200 },
    data: { label: "Process B", type: "process" },
  },
  {
    id: "4",
    type: "card",
    position: { x: 250, y: 350 },
    data: { label: "End", type: "output" },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e3-4", source: "3", target: "4" },
];

let nodeId = 5;

export default function FlowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const addNode = useCallback(() => {
    const id = String(nodeId++);
    const newNode: Node = {
      id,
      type: "card",
      position: {
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 100,
      },
      data: { label: `Node ${id}`, type: "process" },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">React Flow</h1>
          <p className="text-muted-foreground text-sm">
            ノードの追加・接続・削除ができるインタラクティブなフローエディタ
          </p>
        </div>
        <Button onClick={addNode}>ノードを追加</Button>
      </div>
      <div className="rounded-lg border h-[600px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}
