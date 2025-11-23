// Types for Entity Display Card

export interface EntityDisplayConfig {
  type: string;
  title?: string;
  entities?: string[];
  filter?: EntityDisplayFilter;
  layout?: 'list' | 'grid' | 'gauge' | 'compact' | 'detailed';
  columns?: number;
  group_by?: 'type' | 'area' | 'floor' | 'none';
  show_header?: boolean;
  show_state?: boolean;
  show_icon?: boolean;
  show_name?: boolean;
  show_unit?: boolean;
  show_last_changed?: boolean;
  show_graph?: boolean;
  sort_by?: 'name' | 'state' | 'last_changed' | 'area';
  sort_reverse?: boolean;
  ignore_invalid?: boolean;
  max_entities?: number;  // Limit počtu zobrazených entit
  entity_types?: EntityTypeConfig[];
  theme?: 'default' | 'modern' | 'minimal';
  card_mod?: any;
  // Graf konfigurace
  graph_type?: 'line' | 'bar' | 'area';
  graph_hours?: number;
  graph_height?: number;
  graph_line_color?: string;
  graph_fill?: boolean;
}

export interface EntityDisplayFilter {
  include?: FilterRule[];
  exclude?: FilterRule[];
  device_class?: string[];
  domain?: string[];
}

export interface FilterRule {
  domain?: string;
  device_class?: string;
  entity_id?: string;
  area?: string;
  floor?: string;
  attributes?: Record<string, any>;
  state?: string;
}

export interface EntityTypeConfig {
  device_class: string;
  icon?: string;
  color?: string;
  unit?: string;
  ranges?: ValueRange[];
  format?: 'number' | 'text' | 'percentage' | 'duration';
  precision?: number;
  show_graph?: boolean;
  graph_hours?: number;
  custom_name?: string;
}

export interface ValueRange {
  min?: number;
  max?: number;
  color: string;
  icon?: string;
  label?: string;
  warning?: boolean;
}

export interface ProcessedEntity {
  entity_id: string;
  name: string;
  state: string | number;
  unit?: string;
  icon: string;
  color: string;
  device_class?: string;
  area?: string;
  floor?: string;
  last_changed: Date;
  attributes: Record<string, any>;
  warning?: boolean;
  graph_data?: number[];
}

export interface GroupedEntities {
  [key: string]: ProcessedEntity[];
}

// Default configurations for common entity types
export const DEFAULT_ENTITY_TYPES: Record<string, EntityTypeConfig> = {
  temperature: {
    device_class: 'temperature',
    icon: 'mdi:thermometer',
    unit: '°C',
    precision: 1,
    show_graph: true,
    graph_hours: 24,
    ranges: [
      { max: 10, color: '#3498db', icon: 'mdi:snowflake', label: 'Studené' },
      { min: 10, max: 18, color: '#5dade2', icon: 'mdi:thermometer-low', label: 'Chladné' },
      { min: 18, max: 24, color: '#52c41a', icon: 'mdi:thermometer', label: 'Príjemné' },
      { min: 24, max: 28, color: '#faad14', icon: 'mdi:thermometer-high', label: 'Teplé' },
      { min: 28, color: '#f5222d', icon: 'mdi:fire', label: 'Horúce', warning: true },
    ],
  },
  humidity: {
    device_class: 'humidity',
    icon: 'mdi:water-percent',
    unit: '%',
    precision: 0,
    show_graph: true,
    graph_hours: 24,
    ranges: [
      { max: 30, color: '#faad14', icon: 'mdi:water-minus', label: 'Suché', warning: true },
      { min: 30, max: 40, color: '#52c41a', icon: 'mdi:water-percent', label: 'Nízka' },
      { min: 40, max: 60, color: '#1890ff', icon: 'mdi:water-percent', label: 'Optimálna' },
      { min: 60, max: 70, color: '#13c2c2', icon: 'mdi:water-percent', label: 'Vysoká' },
      { min: 70, color: '#f5222d', icon: 'mdi:water-plus', label: 'Vlhké', warning: true },
    ],
  },
  battery: {
    device_class: 'battery',
    icon: 'mdi:battery',
    unit: '%',
    precision: 0,
    ranges: [
      { max: 10, color: '#f5222d', icon: 'mdi:battery-10', label: 'Kritické', warning: true },
      { min: 10, max: 20, color: '#fa8c16', icon: 'mdi:battery-20', label: 'Nízke', warning: true },
      { min: 20, max: 50, color: '#faad14', icon: 'mdi:battery-50', label: 'Stredné' },
      { min: 50, max: 80, color: '#52c41a', icon: 'mdi:battery-70', label: 'Dobré' },
      { min: 80, color: '#1890ff', icon: 'mdi:battery', label: 'Plné' },
    ],
  },
  pressure: {
    device_class: 'pressure',
    icon: 'mdi:gauge',
    unit: 'hPa',
    precision: 0,
    show_graph: true,
    graph_hours: 48,
    ranges: [
      { max: 980, color: '#f5222d', icon: 'mdi:weather-pouring', label: 'Nízky' },
      { min: 980, max: 1000, color: '#faad14', icon: 'mdi:weather-cloudy', label: 'Premenlivý' },
      { min: 1000, max: 1020, color: '#52c41a', icon: 'mdi:weather-partly-cloudy', label: 'Normálny' },
      { min: 1020, color: '#1890ff', icon: 'mdi:weather-sunny', label: 'Vysoký' },
    ],
  },
  illuminance: {
    device_class: 'illuminance',
    icon: 'mdi:brightness-5',
    unit: 'lx',
    precision: 0,
    ranges: [
      { max: 1, color: '#1a1a1a', icon: 'mdi:brightness-1', label: 'Tma' },
      { min: 1, max: 50, color: '#595959', icon: 'mdi:brightness-2', label: 'Šero' },
      { min: 50, max: 200, color: '#8c8c8c', icon: 'mdi:brightness-4', label: 'Ztmavené' },
      { min: 200, max: 500, color: '#bfbfbf', icon: 'mdi:brightness-5', label: 'Světlé' },
      { min: 500, color: '#fafafa', icon: 'mdi:brightness-7', label: 'Velmi světlé' },
    ],
  },
  power: {
    device_class: 'power',
    icon: 'mdi:flash',
    unit: 'W',
    precision: 1,
    show_graph: true,
    graph_hours: 24,
    ranges: [
      { max: 10, color: '#52c41a', icon: 'mdi:flash-off', label: 'Nízký' },
      { min: 10, max: 100, color: '#1890ff', icon: 'mdi:flash-outline', label: 'Střední' },
      { min: 100, max: 500, color: '#faad14', icon: 'mdi:flash', label: 'Vysoký' },
      { min: 500, color: '#f5222d', icon: 'mdi:flash-alert', label: 'Velmi vysoký', warning: true },
    ],
  },
  energy: {
    device_class: 'energy',
    icon: 'mdi:lightning-bolt',
    unit: 'kWh',
    precision: 2,
    show_graph: true,
    graph_hours: 168,
    ranges: [
      { max: 1, color: '#52c41a', icon: 'mdi:leaf', label: 'Nízká' },
      { min: 1, max: 5, color: '#1890ff', icon: 'mdi:lightning-bolt-outline', label: 'Střední' },
      { min: 5, max: 10, color: '#faad14', icon: 'mdi:lightning-bolt', label: 'Vysoká' },
      { min: 10, color: '#f5222d', icon: 'mdi:alert', label: 'Velmi vysoká' },
    ],
  },
  carbon_dioxide: {
    device_class: 'carbon_dioxide',
    icon: 'mdi:molecule-co2',
    unit: 'ppm',
    precision: 0,
    show_graph: true,
    graph_hours: 24,
    ranges: [
      { max: 600, color: '#52c41a', icon: 'mdi:check-circle', label: 'Výborné' },
      { min: 600, max: 800, color: '#1890ff', icon: 'mdi:information', label: 'Dobré' },
      { min: 800, max: 1000, color: '#faad14', icon: 'mdi:alert-circle', label: 'Střední' },
      { min: 1000, max: 1500, color: '#fa8c16', icon: 'mdi:alert', label: 'Horší', warning: true },
      { min: 1500, color: '#f5222d', icon: 'mdi:alert-octagon', label: 'Zlé', warning: true },
    ],
  },
  volatile_organic_compounds: {
    device_class: 'volatile_organic_compounds',
    icon: 'mdi:air-filter',
    unit: 'µg/m³',
    precision: 0,
    ranges: [
      { max: 50, color: '#52c41a', label: 'Výborné' },
      { min: 50, max: 100, color: '#1890ff', label: 'Dobré' },
      { min: 100, max: 300, color: '#faad14', label: 'Střední' },
      { min: 300, max: 500, color: '#fa8c16', label: 'Horší', warning: true },
      { min: 500, color: '#f5222d', label: 'Zlé', warning: true },
    ],
  },
  pm25: {
    device_class: 'pm25',
    icon: 'mdi:dots-hexagon',
    unit: 'µg/m³',
    precision: 0,
    ranges: [
      { max: 12, color: '#52c41a', label: 'Dobré' },
      { min: 12, max: 35, color: '#faad14', label: 'Střední' },
      { min: 35, max: 55, color: '#fa8c16', label: 'Nezdravé pro citlivé', warning: true },
      { min: 55, color: '#f5222d', label: 'Nezdravé', warning: true },
    ],
  },
  signal_strength: {
    device_class: 'signal_strength',
    icon: 'mdi:wifi',
    unit: 'dBm',
    precision: 0,
    ranges: [
      { max: -90, color: '#f5222d', icon: 'mdi:wifi-strength-1', label: 'Slabý' },
      { min: -90, max: -70, color: '#faad14', icon: 'mdi:wifi-strength-2', label: 'Průměrný' },
      { min: -70, max: -50, color: '#52c41a', icon: 'mdi:wifi-strength-3', label: 'Dobrý' },
      { min: -50, color: '#1890ff', icon: 'mdi:wifi-strength-4', label: 'Výborný' },
    ],
  },
};
