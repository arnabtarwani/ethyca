import type { ParsedSystem } from '../../types/types'

interface DataFlow {
    system: ParsedSystem
    direction: 'incoming' | 'outgoing'
    sharedCategories: string[]
}

interface Props {
    title: string
    flows: DataFlow[]
}

/**
 * Renders the data flow section for a given title and flows
 * @prop title: string
 * @prop flows: DataFlow[]
 * @returns JSX.Element
 */
export function DataFlowSection({ title, flows }: Props) {
    if (flows.length === 0) return null

    return (
        <div className="mb-3">
            <p className="text-[10px] text-zinc-500 uppercase mb-1">{title}</p>
            <div className="space-y-1.5">
                {flows.map(flow => (
                    <div key={flow.system.id} className="text-xs">
                        <p className="text-zinc-300">{flow.system.name}</p>
                        {flow.sharedCategories.length > 0 ? (
                            <p className="text-zinc-500 text-[10px]">{flow.sharedCategories.join(', ')}</p>
                        ) : (
                            <p className="text-zinc-600 text-[10px] italic">no shared categories</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
