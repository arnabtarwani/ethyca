interface Props {
    tags: string[]
    selectedTags: string[]
    onToggle: (tag: string) => void
}

/**
 * Renders the tag toggle group for a given tags, selectedTags and onToggle function
 * @prop tags: string[]
 * @prop selectedTags: string[]
 * @prop onToggle: (tag: string) => void
 * @returns JSX.Element
 */
export function TagToggleGroup({ tags, selectedTags, onToggle }: Props) {
    return (
        <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
                <button
                    key={tag}
                    onClick={() => onToggle(tag)}
                    className={`px-2 py-0.5 text-[10px] rounded ${selectedTags.includes(tag)
                        ? 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-800 hover:text-zinc-300'
                        }`}
                >
                    {tag}
                </button>
            ))}
        </div>
    )
}
