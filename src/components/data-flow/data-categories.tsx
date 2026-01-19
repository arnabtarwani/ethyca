import type { ParsedSystem } from '../../types/types'

interface Props {
    system: ParsedSystem
}

/**
 * Renders the data categories for a given system
 * @prop system: ParsedSystem
 * @returns JSX.Element
 */
export function DataCategories({ system }: Props) {
    if (system.dataCategories.length === 0) {
        return <p className="text-xs text-zinc-600 italic">No data categories</p>
    }

    return (
        <div className="space-y-1.5">
            <span className="text-[10px] text-zinc-500 uppercase">Data Categories</span>
            {system.derivedCategories.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[9px] text-zinc-400 uppercase font-medium mr-1">Derived</span>
                    {system.derivedCategories.map(cat => (
                        <span key={cat} className="px-1.5 py-0.5 text-[10px] rounded bg-zinc-500/10 text-zinc-300 border border-zinc-500/20">
                            {cat}
                        </span>
                    ))}
                </div>
            )}
            {system.providedCategories.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[9px] text-zinc-400 uppercase font-medium mr-1">Provided</span>
                    {system.providedCategories.map(cat => (
                        <span key={cat} className="px-1.5 py-0.5 text-[10px] rounded bg-zinc-500/10 text-zinc-300 border border-zinc-500/20">
                            {cat}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}
