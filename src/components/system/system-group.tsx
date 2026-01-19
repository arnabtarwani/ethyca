import type { SystemGroup as GroupType } from '../../types/types'
import { icons } from '../ui/icons'
import { SystemCard } from './system-card'

interface Props {
    group: GroupType
    onSystemClick?: (systemId: string) => void
}

/**
 * Renders the system group for a given group and onSystemClick function
 * @prop group: GroupType
 * @prop onSystemClick: (systemId: string) => void
 * @returns JSX.Element
 */
export function SystemGroup({ group, onSystemClick }: Props) {
    const icon = icons[group.groupKey]

    return (
        <div className={`rounded-xl border bg-zinc-900 border-zinc-800`}>
            <div className="px-4 py-3 border-b border-zinc-800/50">
                <div className="flex items-center gap-2">
                    {icon && <span className={`text-zinc-400`}>{icon}</span>}
                    <h2 className={`text-sm font-medium text-zinc-200`}>{group.groupLabel}</h2>
                    <span className="ml-auto text-xs text-zinc-600">
                        {group.systems.length}
                    </span>
                </div>
            </div>
            <div className="p-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {group.systems.map((system) => (
                    <SystemCard
                        key={system.id}
                        system={system}
                        onClick={onSystemClick ? () => onSystemClick(system.id) : undefined}
                    />
                ))}
            </div>
        </div>
    )
}
