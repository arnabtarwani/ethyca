import { useState } from 'react'
import type { ParsedSystem } from '../../types/types'
import { DataCategories } from '../data-flow/data-categories'
import { DataSubjects } from '../data-flow/data-subjects'
import { PrivacyDeclarations } from '../data-flow/privacy-declarations'
import { SystemDependencies } from './system-dependencies'

interface Props {
    system: ParsedSystem
    onClick?: () => void
}

/**
 * Renders the system card for a given system and onClick function
 * @prop system: ParsedSystem
 * @prop onClick: () => void
 * @returns JSX.Element
 */
export function SystemCard({ system, onClick }: Props) {
    const [expanded, setExpanded] = useState(false)

    return (
        <div
            data-system-id={system.id}
            onClick={onClick}
            className={`
                rounded-lg border bg-zinc-900/80 p-4
                border-zinc-800
                ${onClick ? `cursor-pointer hover:border-zinc-700` : ''}
            `}
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                    <h3 className="font-medium text-zinc-100 text-sm truncate">
                        {system.name}
                    </h3>
                    <p className={`text-xs font-mono text-zinc-400`}>{system.id}</p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setExpanded(!expanded)
                    }}
                    className="text-zinc-500 hover:text-zinc-300 p-1"
                >
                    <svg
                        className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Data Categories - grouped by derived/provided */}
            <DataCategories system={system} />

            {expanded && (
                <div className="mt-3 pt-3 border-t border-zinc-800 space-y-3">
                    <p className="text-xs text-zinc-400">{system.description}</p>

                    {/* Data Subjects */}
                    <DataSubjects system={system} />

                    {/* Privacy Declarations */}
                    <PrivacyDeclarations declarations={system.privacyDeclarations} size="sm" />

                    {/* Dependencies */}
                    <SystemDependencies dependencies={system.dependencies} />
                </div>
            )}
        </div>
    )
}
