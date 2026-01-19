import type { ParsedSystem } from '../../types/types'

interface Props {
    system: ParsedSystem
}

/**
 * Renders the data subjects for a given system
 * @prop system: ParsedSystem
 * @returns JSX.Element
 */
export function DataSubjects({ system }: Props) {
    const subjects = [...new Set(system.privacyDeclarations.flatMap(d => d.dataSubjects))]

    if (subjects.length === 0) return null

    return (
        <div>
            <span className="text-[10px] text-zinc-500 uppercase">Data Subjects</span>
            <div className="flex flex-wrap gap-1 mt-1">
                {subjects.map(subject => (
                    <span key={subject} className="px-1.5 py-0.5 text-[10px] rounded bg-zinc-500/10 text-zinc-300 border border-zinc-500/20">
                        {subject}
                    </span>
                ))}
            </div>
        </div>
    )
}
