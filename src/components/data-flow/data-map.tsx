import { useMemo } from 'react'
import type { ParsedSystem, FilterState } from '../../types/types'
import { filterSystems, groupSystems } from '../../utils/parser'
import { SystemGroup } from '../system/system-group'

interface Props {
    systems: ParsedSystem[]
    filters: FilterState
    onSystemClick?: (systemId: string) => void
}

/**
 * Renders the data map for a given systems, filters and onSystemClick function
 * @prop systems: ParsedSystem[]
 * @prop filters: FilterState
 * @prop onSystemClick: (systemId: string) => void
 * @returns JSX.Element
 */
export function DataMap({ systems, filters, onSystemClick }: Props) {
    const filtered = useMemo(
        () => filterSystems(systems, filters),
        [systems, filters]
    )

    const groups = useMemo(
        () => groupSystems(filtered, filters.layoutMode),
        [filtered, filters.layoutMode]
    )

    if (filtered.length === 0) {
        return (
            <div className="flex items-center justify-center h-full overflow-hidden text-zinc-500">
                <p className="text-sm">No systems match the current filters</p>
            </div>
        )
    }

    return (
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-2">
            {groups.map((group) => (
                <SystemGroup
                    key={group.groupKey}
                    group={group}
                    onSystemClick={onSystemClick}
                />
            ))}
        </div>
    )
}
