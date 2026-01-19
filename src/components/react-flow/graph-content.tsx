import {
    Background,
    Controls,
    ReactFlow,
    useReactFlow,
    type Node
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import type { ParsedSystem } from '../../types/types'
import {
    COLUMN_GAP,
    NODE_HEIGHT, NODE_WIDTH,
    SYSTEM_TYPE_ORDER, TYPE_COLORS, calcSideHeight, groupByType
} from '../../utils/common'
import { SystemDetailsPanel } from '../system/system-details-panel'
import { SystemNode, type SystemNodeData } from './system-node'
import { buildSideNodes } from './side-nodes'

export interface GraphContentProps {
    systems: ParsedSystem[]
    selectedId: string
    onNodeClick: (id: string) => void
    onClose: () => void
}

const nodeTypes = { system: SystemNode }

/**
 * Renders the graph content for a given systems, selectedId, onNodeClick and onClose
 * @prop systems: ParsedSystem[]
 * @prop selectedId: string
 * @prop onNodeClick: (id: string) => void
 * @prop onClose: () => void
 * @returns JSX.Element
 */
export function GraphContent({ systems, selectedId, onNodeClick, onClose }: GraphContentProps) {
    const { fitView } = useReactFlow()
    const prevId = useRef(selectedId)

    const systemMap = useMemo(() => new Map(systems.map(s => [s.id, s])), [systems])

    const selected = systemMap.get(selectedId)
    if (!selected) return null

    const dependents = systems.filter(s => s.dependencies.includes(selectedId))
    const dependencies = selected.dependencies
        .map(id => systemMap.get(id))
        .filter((s): s is ParsedSystem => !!s)

    const dataFlows = useMemo(() => {
        const selectedCats = new Set(selected.dataCategories)
        return [
            ...dependents.map(sys => ({
                system: sys,
                direction: 'incoming' as const,
                sharedCategories: sys.dataCategories.filter(c => selectedCats.has(c)),
            })),
            ...dependencies.map(sys => ({
                system: sys,
                direction: 'outgoing' as const,
                sharedCategories: selected.dataCategories.filter(c => new Set(sys.dataCategories).has(c)),
            })),
        ]
    }, [selected, dependents, dependencies])

    const { nodes, edges } = useMemo(() => {
        const leftGroups = groupByType(dependents)
        const rightGroups = groupByType(dependencies)
        const leftHeight = calcSideHeight(leftGroups)
        const rightHeight = calcSideHeight(rightGroups)
        const totalHeight = Math.max(leftHeight, rightHeight, NODE_HEIGHT) + 40

        const leftX = 20
        const centerX = leftX + NODE_WIDTH + COLUMN_GAP
        const rightX = centerX + NODE_WIDTH + COLUMN_GAP

        const centerNode: Node = {
            id: selected.id,
            type: 'system',
            position: { x: centerX, y: totalHeight / 2 - NODE_HEIGHT / 2 },
            data: { name: selected.name, systemType: selected.systemType, nodeType: 'center' } satisfies SystemNodeData,
        }

        const left = buildSideNodes(leftGroups, leftX, 'dependent', totalHeight, leftHeight, selected.id)
        const right = buildSideNodes(rightGroups, rightX, 'dependency', totalHeight, rightHeight, selected.id)

        return {
            nodes: [centerNode, ...left.nodes, ...right.nodes],
            edges: [...left.edges, ...right.edges],
        }
    }, [selected, dependents, dependencies])

    const handleNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => {
            if (node.id !== selectedId) onNodeClick(node.id)
        },
        [selectedId, onNodeClick]
    )

    useEffect(() => {
        if (prevId.current !== selectedId) {
            const timer = setTimeout(() => fitView({ padding: 0.2, duration: 200 }), 50)
            prevId.current = selectedId
            return () => clearTimeout(timer)
        }
    }, [selectedId, fitView])

    const incomingFlows = dataFlows.filter(f => f.direction === 'incoming')
    const outgoingFlows = dataFlows.filter(f => f.direction === 'outgoing')

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
            <div
                className="bg-zinc-900 border border-zinc-700 rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                    <h3 className="text-sm font-medium text-zinc-200">{selected.name}</h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-1 overflow-clip min-h-[75vh] max-h-[75vh]">
                    <div className="flex-1 w-2/3">
                        {edges.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-sm text-zinc-500">No connections</p>
                            </div>
                        ) : (
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                nodeTypes={nodeTypes}
                                onNodeClick={handleNodeClick}
                                fitView
                                fitViewOptions={{ padding: 0.2 }}
                                proOptions={{ hideAttribution: true }}
                                nodesDraggable={false}
                                nodesConnectable={false}
                                elementsSelectable
                                panOnScroll
                                zoomOnScroll
                                minZoom={0.5}
                                maxZoom={2}
                            >
                                <Background color="#27272a" gap={16} />
                                <Controls showInteractive={false} className="bg-zinc-800! border-zinc-700! [&>button]:bg-zinc-800! [&>button]:border-zinc-700! [&>button]:text-zinc-400! [&>button:hover]:bg-zinc-700!" />
                            </ReactFlow>
                        )}
                    </div>

                    <div className="w-1/3 overflow-y-auto">
                        <SystemDetailsPanel
                            system={selected}
                            incomingFlows={incomingFlows}
                            outgoingFlows={outgoingFlows}
                        />
                    </div>
                </div>

                <div className="flex gap-4 justify-center px-4 py-2 border-t border-zinc-800 text-[10px] text-zinc-500 flex-wrap">
                    {SYSTEM_TYPE_ORDER.map(t => (
                        <span key={t} className="flex items-center gap-1.5">
                            <span
                                className="w-3 rounded-xs"
                                style={{ backgroundColor: `${TYPE_COLORS[t]}40`, border: `1px solid ${TYPE_COLORS[t]}` }}
                            />
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}