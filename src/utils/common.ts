import type { ParsedSystem, SystemType } from "../types/types"

export const NODE_WIDTH = 200
export const NODE_HEIGHT = 44
export const COLUMN_GAP = 80
export const ROW_GAP = 12
export const GROUP_GAP = 24
export const HANDLE_RADIUS = 4
export const SYSTEM_TYPE_ORDER: SystemType[] = ['Application', 'Service', 'Database', 'Integration']

export const TYPE_COLORS: Record<SystemType, string> = {
    Application: '#3b82f6',
    Service: '#10b981',
    Database: '#f59e0b',
    Integration: '#8b5cf6',
}

/**
 * Group dependents and dependencies by system type
 * @param items: ParsedSystem[]
 * @returns Map<SystemType, ParsedSystem[]> which is a map of system types to an array of parsed systems
 */
export const groupByType = (items: ParsedSystem[]) => {
    const groups = new Map<SystemType, ParsedSystem[]>()
    SYSTEM_TYPE_ORDER.forEach(t => groups.set(t, []))
    items.forEach(s => {
        const list = groups.get(s.systemType) || []
        list.push(s)
        groups.set(s.systemType, list)
    })
    return groups
}

/**
 * Calculates the height of the side panel
 * @param groups: Map<SystemType, ParsedSystem[]>
 * @returns number which is the height of the side panel
 */
export const calcSideHeight = (groups: Map<SystemType, ParsedSystem[]>) => {
    let height = 0
    let groupCount = 0
    SYSTEM_TYPE_ORDER.forEach(t => {
        const items = groups.get(t) || []
        if (items.length > 0) {
            height += items.length * NODE_HEIGHT + (items.length - 1) * ROW_GAP
            groupCount++
        }
    })
    height += Math.max(0, groupCount - 1) * GROUP_GAP
    return height
}
