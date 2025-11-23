// Localization for Entity Display Card

export interface Translations {
  // Common
  title: string;

  // Layouts
  layout_list: string;
  layout_grid: string;
  layout_gauge: string;
  layout_compact: string;
  layout_detailed: string;

  // Group types
  group_type: string;
  group_area: string;
  group_floor: string;
  group_none: string;

  // Sort
  sort_name: string;
  sort_state: string;
  sort_last_changed: string;
  sort_area: string;

  // Device classes
  device_temperature: string;
  device_humidity: string;
  device_battery: string;
  device_pressure: string;
  device_illuminance: string;
  device_power: string;
  device_energy: string;
  device_carbon_dioxide: string;
  device_volatile_organic_compounds: string;
  device_pm25: string;
  device_signal_strength: string;
  device_other: string;

  // Empty state
  empty_no_entities: string;

  // Time
  time_now: string;
  time_minutes_ago: string;
  time_hours_ago: string;
  time_days_ago: string;
  time_last_changed: string;

  // Editor
  editor_title: string;
  editor_layout: string;
  editor_columns: string;
  editor_group_by: string;
  editor_sort_by: string;
  editor_sort_reverse: string;
  editor_ignore_invalid: string;
  editor_ignore_invalid_desc: string;

  editor_section_graphs: string;
  editor_section_graphs_desc: string;
  editor_graph_type: string;
  editor_graph_hours: string;
  editor_graph_height: string;
  editor_graph_fill: string;

  editor_section_display: string;
  editor_show_header: string;
  editor_show_icon: string;
  editor_show_name: string;
  editor_show_state: string;
  editor_show_unit: string;
  editor_show_last_changed: string;
  editor_show_graph: string;

  editor_tab_general: string;
  editor_tab_entities: string;
  editor_tab_filters: string;
  editor_tab_types: string;
  editor_tab_examples: string;

  editor_manual_entities: string;
  editor_manual_entities_desc: string;
  editor_add_entity: string;

  editor_filters: string;
  editor_filters_desc: string;
  editor_device_class_label: string;
  editor_add_device_class: string;

  editor_supported_types: string;
  editor_supported_types_desc: string;
  editor_info_tip: string;

  // Graph types
  graph_line: string;
  graph_area: string;
  graph_bar: string;

  // Loading
  loading: string;

  // Groups (for display)
  group_no_area: string;
  group_no_floor: string;
  group_all: string;
}

const translations: Record<string, Translations> = {
  en: {
    title: 'Title',

    layout_list: 'List',
    layout_grid: 'Grid',
    layout_gauge: 'Gauge',
    layout_compact: 'Compact',
    layout_detailed: 'Detailed',

    group_type: 'Type',
    group_area: 'Area',
    group_floor: 'Floor',
    group_none: 'No grouping',

    sort_name: 'Name',
    sort_state: 'State',
    sort_last_changed: 'Last changed',
    sort_area: 'Area',

    device_temperature: 'Temperature',
    device_humidity: 'Humidity',
    device_battery: 'Battery',
    device_pressure: 'Pressure',
    device_illuminance: 'Illuminance',
    device_power: 'Power',
    device_energy: 'Energy',
    device_carbon_dioxide: 'CO₂',
    device_volatile_organic_compounds: 'VOC',
    device_pm25: 'PM2.5',
    device_signal_strength: 'Signal',
    device_other: 'Other',

    empty_no_entities: 'No entities to display',

    time_now: 'just now',
    time_minutes_ago: 'ago',
    time_hours_ago: 'ago',
    time_days_ago: 'ago',
    time_last_changed: 'Last changed',

    editor_title: 'Card title',
    editor_layout: 'Layout',
    editor_columns: 'Number of columns',
    editor_group_by: 'Group by',
    editor_sort_by: 'Sort by',
    editor_sort_reverse: 'Reverse order (descending)',
    editor_ignore_invalid: 'Ignore invalid states (unknown, unavailable)',
    editor_ignore_invalid_desc: 'Hide entities with invalid states',

    editor_section_graphs: 'Graphs',
    editor_section_graphs_desc: 'Graph configuration for detailed layout',
    editor_graph_type: 'Graph type',
    editor_graph_hours: 'History hours',
    editor_graph_height: 'Graph height (px)',
    editor_graph_fill: 'Fill area under graph',

    editor_section_display: 'Display',
    editor_show_header: 'Show header',
    editor_show_icon: 'Show icons',
    editor_show_name: 'Show names',
    editor_show_state: 'Show states',
    editor_show_unit: 'Show units',
    editor_show_last_changed: 'Show last changed',
    editor_show_graph: 'Show graphs (detailed layout)',

    editor_tab_general: 'General',
    editor_tab_entities: 'Entities',
    editor_tab_filters: 'Filters',
    editor_tab_types: 'Types',
    editor_tab_examples: 'Examples',

    editor_manual_entities: 'Manual entities',
    editor_manual_entities_desc: 'Specify entities to display',
    editor_add_entity: 'Add entity',

    editor_filters: 'Filters',
    editor_filters_desc: 'Automatically select entities by criteria',
    editor_device_class_label: 'Device Class (sensor type)',
    editor_add_device_class: 'Add Device Class',

    editor_supported_types: 'Supported entity types',
    editor_supported_types_desc: 'Card automatically recognizes and displays these types:',
    editor_info_tip: 'Tip',

    graph_line: 'Line',
    graph_area: 'Area',
    graph_bar: 'Bar',

    loading: 'Loading...',

    group_no_area: 'No area',
    group_no_floor: 'No floor',
    group_all: 'All',
  },

  cs: {
    title: 'Název',

    layout_list: 'Seznam',
    layout_grid: 'Mřížka',
    layout_gauge: 'Ukazatel',
    layout_compact: 'Kompaktní',
    layout_detailed: 'Podrobné',

    group_type: 'Typ',
    group_area: 'Oblast',
    group_floor: 'Patro',
    group_none: 'Neseskupovat',

    sort_name: 'Název',
    sort_state: 'Stav',
    sort_last_changed: 'Poslední změna',
    sort_area: 'Oblast',

    device_temperature: 'Teplota',
    device_humidity: 'Vlhkost',
    device_battery: 'Baterie',
    device_pressure: 'Tlak',
    device_illuminance: 'Osvětlení',
    device_power: 'Výkon',
    device_energy: 'Energie',
    device_carbon_dioxide: 'CO₂',
    device_volatile_organic_compounds: 'VOC',
    device_pm25: 'PM2.5',
    device_signal_strength: 'Signál',
    device_other: 'Ostatní',

    empty_no_entities: 'Žádné entity k zobrazení',

    time_now: 'právě teď',
    time_minutes_ago: 'před',
    time_hours_ago: 'před',
    time_days_ago: 'před',
    time_last_changed: 'Naposledy změněno',

    editor_title: 'Název karty',
    editor_layout: 'Rozložení',
    editor_columns: 'Počet sloupců',
    editor_group_by: 'Seskupit podle',
    editor_sort_by: 'Řadit podle',
    editor_sort_reverse: 'Obrátit pořadí (sestupně)',
    editor_ignore_invalid: 'Ignorovat neplatné stavy (unknown, unavailable)',
    editor_ignore_invalid_desc: 'Skrýt entity s neplatnými stavy',

    editor_section_graphs: 'Grafy',
    editor_section_graphs_desc: 'Konfigurace grafů pro detailed layout',
    editor_graph_type: 'Typ grafu',
    editor_graph_hours: 'Počet hodin historie',
    editor_graph_height: 'Výška grafu (px)',
    editor_graph_fill: 'Vyplnit oblast pod grafem',

    editor_section_display: 'Zobrazení',
    editor_show_header: 'Zobrazit hlavičku',
    editor_show_icon: 'Zobrazit ikony',
    editor_show_name: 'Zobrazit názvy',
    editor_show_state: 'Zobrazit stavy',
    editor_show_unit: 'Zobrazit jednotky',
    editor_show_last_changed: 'Zobrazit poslední změnu',
    editor_show_graph: 'Zobrazit grafy (detailed layout)',

    editor_tab_general: 'Obecné',
    editor_tab_entities: 'Entity',
    editor_tab_filters: 'Filtry',
    editor_tab_types: 'Typy',
    editor_tab_examples: 'Příklady',

    editor_manual_entities: 'Manuální entity',
    editor_manual_entities_desc: 'Zadejte konkrétní entity, které chcete zobrazit',
    editor_add_entity: 'Přidat entitu',

    editor_filters: 'Filtry',
    editor_filters_desc: 'Automaticky vyberte entity podle kritérií',
    editor_device_class_label: 'Device Class (typ senzoru)',
    editor_add_device_class: 'Přidat Device Class',

    editor_supported_types: 'Podporované typy entit',
    editor_supported_types_desc: 'Karta automaticky rozpozná a zobrazí následující typy:',
    editor_info_tip: 'Tip',

    graph_line: 'Čára',
    graph_area: 'Oblast',
    graph_bar: 'Sloupcový',

    loading: 'Načítání...',

    group_no_area: 'Bez oblasti',
    group_no_floor: 'Bez patra',
    group_all: 'Všechny',
  },
};

export function localize(key: keyof Translations, language: string = 'en'): string {
  // Normalize language code (en-US -> en, cs-CZ -> cs)
  const lang = language.split('-')[0].toLowerCase();

  // Get translation for language, fallback to english
  const langTranslations = translations[lang] || translations.en;

  return langTranslations[key] || translations.en[key] || key;
}

export function getLanguage(hass: any): string {
  return hass?.language || hass?.locale?.language || 'en';
}
