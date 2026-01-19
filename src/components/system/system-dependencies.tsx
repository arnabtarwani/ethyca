interface Props {
    dependencies: string[]
}

/**
 * Renders the system dependencies for a given dependencies
 * @prop dependencies: string[]
 * @returns JSX.Element
 */
export function SystemDependencies({ dependencies }: Props) {
    if (dependencies.length === 0) return null

    return (
        <div>
            <p className="text-[10px] text-zinc-500 uppercase mb-1">
                Dependencies ({dependencies.length})
            </p>
            <div className="flex flex-wrap gap-1">
                {dependencies.map((dep) => (
                    <span key={dep} className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-800 text-zinc-500">
                        {dep}
                    </span>
                ))}
            </div>
        </div>
    )
}
