import { useState } from 'react'
import { useSampleData } from '../hooks/use-sample-data'
import { DataMap } from '../components/data-flow/data-map'
import { FilterControls } from '../components/filter/filter-controls'
import { ReactFlowGraph } from '../components/react-flow'
import type { FilterState } from '../types/types'

export default function App() {
    const { systems, allDataUses, allCategories } = useSampleData()

    const [filters, setFilters] = useState<FilterState>({
        dataUse: null,
        dataCategories: [],
        dataSourceType: null,
        layoutMode: 'system_type',
    })

    const [selectedSystem, setSelectedSystem] = useState<string | null>(null)

    return (
        <div className="min-h-screen bg-zinc-950">
            <header className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
                <div className="mx-auto px-4 py-3 flex items-center justify-between">
                    <div>
                        <h1 className="text-base font-medium text-zinc-100">Ethyca Test</h1>
                    </div>
                    <div className="text-xs text-zinc-500">
                        {systems.length} systems
                    </div>
                </div>
            </header>

            <div className="w-full mx-auto px-4 py-6">
                <div className="flex gap-6">
                    <aside className="hidden lg:block w-56 shrink-0">
                        <div className="sticky top-18 space-y-4">
                            <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900">
                                <FilterControls
                                    filters={filters}
                                    onFiltersChange={setFilters}
                                    allDataUses={allDataUses}
                                    allCategories={allCategories}
                                />
                            </div>
                            <p className="text-[10px] text-zinc-600 px-1">
                                Click a card to view its dependencies
                            </p>
                        </div>
                    </aside>

                    <main className="flex-1 min-w-0">
                        <DataMap
                            systems={systems}
                            filters={filters}
                            onSystemClick={setSelectedSystem}
                        />
                    </main>
                </div>
            </div>

            {selectedSystem && (
                <ReactFlowGraph
                    systems={systems}
                    selectedId={selectedSystem}
                    onNodeClick={setSelectedSystem}
                    onClose={() => setSelectedSystem(null)}
                />
            )}
        </div>
    )
}
