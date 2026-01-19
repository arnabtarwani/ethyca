import type { PrivacyDeclaration } from '../../types/types'
import { formatDataUse } from '../../utils/parser'

interface Props {
    declarations: PrivacyDeclaration[]
    size?: 'sm' | 'md'
}

/**
 * Renders the privacy declarations for a given declarations and size
 * @prop declarations: PrivacyDeclaration[]
 * @prop size: 'sm' | 'md'
 * @returns JSX.Element
 */
export function PrivacyDeclarations({ declarations, size = 'md' }: Props) {
    if (declarations.length === 0) return null

    const isSmall = size === 'sm'

    return (
        <div>
            <p className={`${isSmall ? 'text-[10px]' : 'text-xs'} text-zinc-500 uppercase mb-1 ${isSmall ? '' : 'tracking-wide'}`}>
                Privacy Declarations
            </p>
            <div className="space-y-2">
                {declarations.map((decl, i) => (
                    <div key={i} className={`${isSmall ? 'text-xs' : 'text-xs'} bg-zinc-800/50 rounded p-2`}>
                        <p className="text-zinc-200 font-medium">{decl.name}</p>
                        <p className="text-zinc-500 text-[10px] mt-0.5">
                            {formatDataUse(decl.dataUse)} · {decl.dataSubjects.join(', ')}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {decl.dataCategories.map((cat) => (
                                <span key={cat} className="px-1 py-0.5 text-[9px] rounded bg-zinc-700 text-zinc-400">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
