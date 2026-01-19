import { ReactFlowProvider } from "@xyflow/react";
import { type GraphContentProps, GraphContent } from "./graph-content";

export function ReactFlowGraph(props: GraphContentProps) {
    return (
        <ReactFlowProvider>
            <GraphContent {...props} />
        </ReactFlowProvider>
    )
}
