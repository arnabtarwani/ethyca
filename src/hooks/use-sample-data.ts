import { useMemo } from "react"
import { sampleData } from "../utils/sample-data"
import {
    parseAllSystems,
    extractAllDataUses,
    extractAllCategories
} from "../utils/parser"

/**
 * This hook is mock for the actual API call to get the data. It returns the sample data parsed into a format that can be used by the app. We purposely use useMemo to memoize the data so that it doesn't re-parse the data on every render and to avoid unnecessary re-renders.
 * @returns
 * - systems: ParsedSystem[] - Parsed systems from the sample data
 * - allDataUses: string[] - All unique data uses in the sample data
 * - allCategories: string[] - All unique categories in the sample data
 */
export const useSampleData = () => {
    const systems = useMemo(() => parseAllSystems(sampleData), [sampleData])
    const allDataUses = useMemo(() => extractAllDataUses(systems), [systems])
    const allCategories = useMemo(() => extractAllCategories(systems), [systems])

    return { systems, allDataUses, allCategories }
}