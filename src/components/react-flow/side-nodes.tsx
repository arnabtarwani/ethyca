import { type Edge, type Node, MarkerType } from "@xyflow/react";
import type { SystemNodeData } from ".";
import type { SystemType, ParsedSystem } from "../../types/types";
import { SYSTEM_TYPE_ORDER, TYPE_COLORS, NODE_HEIGHT, ROW_GAP, GROUP_GAP } from "../../utils/common";

/**
 * Builds nodes for one side of the graph (dependents or dependencies)
 * @prop groups: Map<SystemType, ParsedSystem[]>
 * @prop x: number
 * @prop nodeType: 'dependent' | 'dependency'
 * @prop totalHeight: number
 * @prop sideHeight: number
 * @prop centerId: string
 * @returns { nodes: Node[], edges: Edge[] } which is an object containing the nodes and edges for the side of the graph
 */
export function buildSideNodes(
    groups: Map<SystemType, ParsedSystem[]>,
    x: number,
    nodeType: 'dependent' | 'dependency',
    totalHeight: number,
    sideHeight: number,
    centerId: string,
): { nodes: Node[]; edges: Edge[] } {
    const nodes: Node[] = []
    const edges: Edge[] = []
    let y = (totalHeight - sideHeight) / 2

    for (const systemType of SYSTEM_TYPE_ORDER) {
        const items = groups.get(systemType) || []
        if (!items.length) continue

        for (let i = 0; i < items.length; i++) {
            const sys = items[i]
            const strokeColor = TYPE_COLORS[sys.systemType]

            nodes.push({
                id: sys.id,
                type: 'system',
                position: { x, y: y + i * (NODE_HEIGHT + ROW_GAP) },
                data: { name: sys.name, systemType: sys.systemType, nodeType } satisfies SystemNodeData,
            })

            // Edge direction depends on node type
            const [source, target] = nodeType === 'dependent'
                ? [sys.id, centerId]
                : [centerId, sys.id]

            edges.push({
                id: `${source}-${target}`,
                source,
                target,
                type: 'smoothstep',
                style: { stroke: strokeColor, strokeWidth: 1 },
                markerEnd: { type: MarkerType.Arrow, color: strokeColor },
            })
        }

        y += items.length * NODE_HEIGHT + (items.length - 1) * ROW_GAP + GROUP_GAP
    }

    return { nodes, edges }
}
