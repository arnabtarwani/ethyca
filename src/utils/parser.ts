import type {
    RawSystem,
    ParsedSystem,
    SystemType,
    SystemGroup,
    LayoutMode,
    FilterState
} from '../types/types';

/**
 * Extracts the most nested subcategory from a full data category path
 * e.g., "user.derived.identifiable.location" -> "location"
 */
export function simplifyDataCategory(fullCategory: string): string {
    const parts = fullCategory.split('.');
    return parts[parts.length - 1];
}

/**
 * Extracts the data source type from a full category path
 * e.g., "user.derived.identifiable.device.cookie_id" -> "derived"
 * e.g., "user.provided.identifiable.contact.email" -> "provided"
 */
export function getDataSourceType(fullCategory: string): 'derived' | 'provided' {
    return fullCategory.includes('.derived.') ? 'derived' : 'provided';
}

/**
 * Transforms a raw system from the API into a parsed system for rendering. This function creates sets of full data categories, data uses, simplified data categories, derived data categories and provided data categories.
 * @param raw: RawSystem - Raw system from the API
 * @returns ParsedSystem - Parsed system from the raw system
 */
export function parseSystem(raw: RawSystem): ParsedSystem {
    const allFullCategories = new Set<string>();
    const allDataUses = new Set<string>();
    const simplifiedCategories = new Set<string>();
    const derivedCats = new Set<string>();
    const providedCats = new Set<string>();

    const privacyDeclarations = raw.privacy_declarations.map(decl => {
        decl.data_categories.forEach(cat => allFullCategories.add(cat));
        allDataUses.add(decl.data_use);

        return {
            name: decl.name,
            dataCategories: decl.data_categories.map(simplifyDataCategory),
            dataSubjects: decl.data_subjects,
            dataUse: decl.data_use,
        };
    });

    allFullCategories.forEach(cat => {
        const simplified = simplifyDataCategory(cat);
        simplifiedCategories.add(simplified);

        const sourceType = getDataSourceType(cat);
        if (sourceType === 'derived') {
            derivedCats.add(simplified);
        } else if (sourceType === 'provided') {
            providedCats.add(simplified);
        }
    });

    return {
        id: raw.fides_key,
        name: raw.name,
        description: raw.description,
        systemType: raw.system_type as SystemType,
        dataCategories: Array.from(simplifiedCategories).sort(),
        fullDataCategories: Array.from(allFullCategories).sort(),
        derivedCategories: Array.from(derivedCats).sort(),
        providedCategories: Array.from(providedCats).sort(),
        dataUses: Array.from(allDataUses).sort(),
        privacyDeclarations,
        dependencies: raw.system_dependencies,
    };
}

/**
 * Parses all raw systems, deduplicating by fides_key
 * @param rawSystems: RawSystem[] - Raw systems from the API
 * @returns ParsedSystem[] - Parsed systems from the raw systems
 */
export function parseAllSystems(rawSystems: RawSystem[]): ParsedSystem[] {
    const systemMap = new Map<string, ParsedSystem>();

    rawSystems.forEach(raw => {
        // Deduplicate by fides_key (there's a duplicate in sample data)
        if (!systemMap.has(raw.fides_key)) {
            systemMap.set(raw.fides_key, parseSystem(raw));
        }
    });

    return Array.from(systemMap.values());
}

/**
 * Filters systems based on the current filter state
 * @param systems: ParsedSystem[] - Parsed systems from the raw systems
 * @param filters: FilterState - Current filter state
 * @returns ParsedSystem[] - Filtered systems
 */
export function filterSystems(
    systems: ParsedSystem[],
    filters: FilterState
): ParsedSystem[] {
    return systems.filter(system => {
        // Filter by data use
        if (filters.dataUse && !system.dataUses.includes(filters.dataUse)) {
            return false;
        }

        // Filter by data categories (system must have ALL selected categories)
        if (filters.dataCategories.length > 0) {
            const hasAllCategories = filters.dataCategories.every(cat =>
                system.fullDataCategories.some(fullCat =>
                    fullCat.includes(cat) || simplifyDataCategory(fullCat) === cat
                )
            );
            if (!hasAllCategories) return false;
        }

        // Filter by data source type (derived or provided)
        if (filters.dataSourceType) {
            if (filters.dataSourceType === 'derived' && system.derivedCategories.length === 0) {
                return false;
            }
            if (filters.dataSourceType === 'provided' && system.providedCategories.length === 0) {
                return false;
            }
        }

        return true;
    });
}

/**
 * Groups systems by the specified layout mode. This is intended to be used for the tabbed layout mode which is either System Type or Data Use.
 * @param systems: ParsedSystem[]
 * @param layoutMode: LayoutMode 
 * @returns SystemGroup[] which is an array of objects with the group key, group label and systems
 */
export function groupSystems(
    systems: ParsedSystem[],
    layoutMode: LayoutMode
): SystemGroup[] {
    const groups = new Map<string, ParsedSystem[]>();

    if (layoutMode === 'system_type') {
        // Group by system type - this is hardcoded as we know the system types from the sample data. In production, we would need to create a set to handle the possible types. 
        const typeOrder: SystemType[] = ['Application', 'Service', 'Database', 'Integration'];

        typeOrder.forEach(type => {
            groups.set(type, []);
        });

        // Group by system type
        systems.forEach(system => {
            const existing = groups.get(system.systemType) || [];
            existing.push(system);
            groups.set(system.systemType, existing);
        });

        return typeOrder
            .filter(type => (groups.get(type)?.length ?? 0) > 0)
            .map(type => ({
                groupKey: type,
                groupLabel: type,
                systems: groups.get(type) || [],
            }));
    } else {
        // Group by data use
        systems.forEach(system => {
            system.dataUses.forEach(use => {
                const existing = groups.get(use) || [];
                // Avoid duplicates if system has multiple uses
                if (!existing.find(s => s.id === system.id)) {
                    existing.push(system);
                }
                groups.set(use, existing);
            });

            // Systems with no data uses go into "Uncategorized"
            if (system.dataUses.length === 0) {
                const existing = groups.get('uncategorized') || [];
                existing.push(system);
                groups.set('uncategorized', existing);
            }
        });

        return Array.from(groups.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, systemList]) => ({
                groupKey: key,
                groupLabel: formatDataUse(key),
                systems: systemList,
            }));
    }
}

/**
 * Formats a data use string for display
 * e.g., "advertising.third_party" -> "Advertising Third Party"
 * @param dataUse: string - Data use string to format
 * @returns string - Formatted data use string
 */
export function formatDataUse(dataUse: string): string {
    return dataUse
        .split('.')
        .map(part =>
            part
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
        )
        .join(' › ');
}

/**
 * Extracts all unique data uses from systems
 * @param systems: ParsedSystem[] - Parsed systems from the raw systems
 * @returns string[] - All unique data uses from the systems
 */
export function extractAllDataUses(systems: ParsedSystem[]): string[] {
    const uses = new Set<string>();
    systems.forEach(system => {
        system.dataUses.forEach(use => uses.add(use));
    });
    return Array.from(uses).sort();
}

/**
 * Extracts all unique simplified data categories from systems
 * @param systems: ParsedSystem[] - Parsed systems from the raw systems
 * @returns string[] - All unique simplified data categories from the systems
 */
export function extractAllCategories(systems: ParsedSystem[]): string[] {
    const categories = new Set<string>();
    systems.forEach(system => {
        system.dataCategories.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
}
