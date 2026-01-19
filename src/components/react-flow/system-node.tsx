import { Handle, Position } from '@xyflow/react'
import type { SystemType } from '../../types/types'
import { TYPE_COLORS } from '../../utils/common'

export interface SystemNodeData extends Record<string, unknown> {
    name: string
    systemType: SystemType
    nodeType: 'center' | 'dependency' | 'dependent'
}

interface SystemNodeProps {
    id: string
    data: SystemNodeData
}

/**
 * Renders the system node for a given data and id
 * @prop data: SystemNodeData
 * @prop id: string
 * @returns JSX.Element
 */
export function SystemNode({ data, id }: SystemNodeProps) {
    const { name, systemType, nodeType } = data
    const isCenter = nodeType === 'center'
    const strokeColor = TYPE_COLORS[systemType]

    return (
        <div
            className={`
                px-3 py-2 rounded-md min-w-[150px]
                border ${isCenter ? 'border-2' : 'border'}
            `}
            style={{
                borderColor: isCenter ? strokeColor : `${strokeColor}80`,
            }}
        >
            {/* Left handle (target) - for nodes that can receive edges */}
            {nodeType !== 'dependent' && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="w-2 h-2 rounded-full"
                    style={{ borderColor: strokeColor, borderWidth: 1 }}
                />
            )}

            {/* Node content */}
            <div className="pointer-events-none">
                <p className="text-xs text-zinc-200 font-medium truncate">{name}</p>
                <p className="text-[9px] font-mono text-zinc-400 truncate">{id}</p>
            </div>

            {/* Right handle (source) - for nodes that can send edges */}
            {nodeType !== 'dependency' && (
                <Handle
                    type="source"
                    position={Position.Right}
                    className="w-2 h-2 rounded-full"
                    style={{ borderColor: strokeColor, borderWidth: 1 }}
                />
            )}
        </div>
    )
}
