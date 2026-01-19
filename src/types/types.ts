// Raw data structure from sample_data.json
export interface RawPrivacyDeclaration {
    data_categories: string[];
    data_subjects: string[];
    data_use: string;
    name: string;
}

export interface RawSystem {
    description: string;
    fides_key: string;
    name: string;
    privacy_declarations: RawPrivacyDeclaration[];
    system_dependencies: string[];
    system_type: string;
}

// Data source type: derived (inferred) vs provided (user-supplied)
export type DataSourceType = 'derived' | 'provided'

// Parsed/transformed data structure for rendering
export interface ParsedSystem {
    id: string; // fides_key
    name: string;
    description: string;
    systemType: SystemType;
    // Deduplicated and simplified data categories (e.g., "location" instead of "user.derived.identifiable.location")
    dataCategories: string[];
    // Original full data categories for filtering
    fullDataCategories: string[];
    // Categories grouped by source type (derived vs provided)
    derivedCategories: string[];
    providedCategories: string[];
    // All unique data uses across privacy declarations
    dataUses: string[];
    // Privacy declarations for detailed view
    privacyDeclarations: PrivacyDeclaration[];
    // System dependencies (fides_keys of dependent systems)
    dependencies: string[];
}

export interface PrivacyDeclaration {
    name: string;
    dataCategories: string[];
    dataSubjects: string[];
    dataUse: string;
}

export type SystemType =
    | 'Application'
    | 'Service'
    | 'Database'
    | 'Integration';

export type LayoutMode = 'system_type' | 'data_use';

// Filter state
export interface FilterState {
    dataUse: string | null;
    dataCategories: string[];
    dataSourceType: DataSourceType | null; // Filter by derived or provided
    layoutMode: LayoutMode;
}

// Grouped systems for rendering
export interface SystemGroup {
    groupKey: string;
    groupLabel: string;
    systems: ParsedSystem[];
}
