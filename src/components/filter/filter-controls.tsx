import type { FilterState, LayoutMode, DataSourceType } from '../../types/types'
import { formatDataUse } from '../../utils/parser'
import { FilterSection } from './filter-section'
import { ToggleButtonGroup } from '../ui/toggle-button-group'
import { TagToggleGroup } from '../ui/tag-toggle-group'

interface Props {
    filters: FilterState
    onFiltersChange: (filters: FilterState) => void
    allDataUses: string[]
    allCategories: string[]
}

/**
 * Renders the filter controls for a given filters, onFiltersChange, allDataUses and allCategories
 * @prop filters: FilterState
 * @prop onFiltersChange: (filters: FilterState) => void
 * @prop allDataUses: string[]
 * @prop allCategories: string[]
 * @returns JSX.Element
 */
export function FilterControls({ filters, onFiltersChange, allDataUses, allCategories }: Props) {
    const setDataUse = (dataUse: string | null) => {
        onFiltersChange({ ...filters, dataUse })
    }

    const toggleCategory = (category: string) => {
        const updated = filters.dataCategories.includes(category)
            ? filters.dataCategories.filter((c) => c !== category)
            : [...filters.dataCategories, category]
        onFiltersChange({ ...filters, dataCategories: updated })
    }

    const setLayoutMode = (layoutMode: LayoutMode) => {
        onFiltersChange({ ...filters, layoutMode })
    }

    const setDataSourceType = (dataSourceType: DataSourceType | null) => {
        onFiltersChange({ ...filters, dataSourceType })
    }

    const clearFilters = () => {
        onFiltersChange({
            dataUse: null,
            dataCategories: [],
            dataSourceType: null,
            layoutMode: filters.layoutMode,
        })
    }

    const hasFilters =
        filters.dataUse !== null ||
        filters.dataCategories.length > 0 ||
        filters.dataSourceType !== null

    return (
        <div className="space-y-4">
            <FilterSection label="Group by">
                <ToggleButtonGroup
                    buttons={[
                        {
                            label: 'System Type',
                            value: 'system_type',
                            isActive: filters.layoutMode === 'system_type',
                            onClick: () => setLayoutMode('system_type'),
                        },
                        {
                            label: 'Data Use',
                            value: 'data_use',
                            isActive: filters.layoutMode === 'data_use',
                            onClick: () => setLayoutMode('data_use'),
                        },
                    ]}
                />
            </FilterSection>

            <FilterSection label="Data Source">
                <ToggleButtonGroup
                    buttons={[
                        {
                            label: 'Derived',
                            value: 'derived',
                            isActive: filters.dataSourceType === 'derived',
                            onClick: () => setDataSourceType(filters.dataSourceType === 'derived' ? null : 'derived'),
                        },
                        {
                            label: 'Provided',
                            value: 'provided',
                            isActive: filters.dataSourceType === 'provided',
                            onClick: () => setDataSourceType(filters.dataSourceType === 'provided' ? null : 'provided'),
                        },
                    ]}
                />
            </FilterSection>

            <FilterSection label="Data Use">
                <select
                    value={filters.dataUse || ''}
                    onChange={(e) => setDataUse(e.target.value || null)}
                    className="w-full px-2 py-1.5 text-xs rounded bg-zinc-800 border border-zinc-700 text-zinc-200"
                >
                    <option value="">All</option>
                    {allDataUses.map((use) => (
                        <option key={use} value={use}>
                            {formatDataUse(use)}
                        </option>
                    ))}
                </select>
            </FilterSection>

            <FilterSection label="Categories">
                <TagToggleGroup
                    tags={allCategories}
                    selectedTags={filters.dataCategories}
                    onToggle={toggleCategory}
                />
            </FilterSection>

            {hasFilters && (
                <button
                    onClick={clearFilters}
                    className="w-full px-2 py-1.5 text-xs rounded bg-zinc-800 text-zinc-400 hover:text-zinc-300"
                >
                    Clear filters
                </button>
            )}
        </div>
    )
}
