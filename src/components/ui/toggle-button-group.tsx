interface ToggleButton {
    label: string
    value: string
    isActive: boolean
    onClick: () => void
}

interface Props {
    buttons: ToggleButton[]
}

/**
 * Renders the toggle button group for a given buttons
 * @prop buttons: ToggleButton[]
 * @returns JSX.Element
 */
export function ToggleButtonGroup({ buttons }: Props) {
    return (
        <div className="flex gap-1">
            {buttons.map((button) => (
                <button
                    key={button.value}
                    onClick={button.onClick}
                    className={`flex-1 px-2 py-1.5 text-xs rounded ${button.isActive
                        ? 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-800 hover:text-zinc-300'
                        }`}
                >
                    {button.label}
                </button>
            ))}
        </div>
    )
}
