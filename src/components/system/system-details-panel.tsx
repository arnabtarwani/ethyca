import type { ParsedSystem } from '../../types/types'
import { DataCategories } from '../data-flow/data-categories'
import { DataSubjects } from '../data-flow/data-subjects'
import { PrivacyDeclarations } from '../data-flow/privacy-declarations'
import { DataFlowSection } from '../data-flow/data-flow-section'

interface DataFlow {
    system: ParsedSystem
    direction: 'incoming' | 'outgoing'
    sharedCategories: string[]
}

interface Props {
    system: ParsedSystem
    incomingFlows: DataFlow[]
    outgoingFlows: DataFlow[]
}

/**
 * Renders the system details panel for a given system, incomingFlows and outgoingFlows
 * @prop system: ParsedSystem
 * @prop incomingFlows: DataFlow[]
 * @prop outgoingFlows: DataFlow[]
 * @returns JSX.Element
 */
export function SystemDetailsPanel({ system, incomingFlows, outgoingFlows }: Props) {
    return (
        <div className="w-full h-full border-l border-zinc-800 p-4 overflow-auto bg-zinc-950/50">
            {/* System Info */}
            <section className="mb-5">
                <h4 className="text-xs text-zinc-500 uppercase tracking-wide mb-2">System Details</h4>
                <p className="text-xs text-zinc-400 mb-3">{system.description}</p>

                <div className="space-y-2">
                    <div>
                        <span className="text-[10px] text-zinc-500 uppercase">Type</span>
                        <p className="text-xs text-zinc-300">{system.systemType}</p>
                    </div>

                    {/* Data Categories */}
                    {system.dataCategories.length > 0 && (
                        <DataCategories system={system} />
                    )}

                    {/* Data Subjects */}
                    <DataSubjects system={system} />
                </div>
            </section>

            {/* Privacy Declarations */}
            {system.privacyDeclarations.length > 0 && (
                <section className="mb-5">
                    <PrivacyDeclarations declarations={system.privacyDeclarations} />
                </section>
            )}

            {/* Data Flow */}
            <section>
                <h4 className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Data Flow</h4>

                <DataFlowSection title="Receives data from" flows={incomingFlows} />
                <DataFlowSection title="Sends data to" flows={outgoingFlows} />

                {incomingFlows.length === 0 && outgoingFlows.length === 0 && (
                    <p className="text-xs text-zinc-600 italic">No data flows</p>
                )}
            </section>
        </div>
    )
}
