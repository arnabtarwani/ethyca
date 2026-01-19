interface FilterSectionProps {
    label: string
    children: React.ReactNode
}

/**
 * Renders the filter section for a given label and children
 * @prop label: string
 * @prop children: React.ReactNode
 * @returns JSX.Element
 */
export function FilterSection({ label, children }: FilterSectionProps) {
    return (
        <div>
            <label className="block text-xs text-zinc-500 mb-1.5">{label}</label>
            {children}
        </div>
    )
}
