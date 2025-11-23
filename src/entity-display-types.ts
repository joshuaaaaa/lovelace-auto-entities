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
      { max: 10, color: '#3498db', icon: 'mdi:snowflake', label: 'Cold' },
      { min: 10, max: 18, color: '#5dade2', icon: 'mdi:thermometer-low', label: 'Cool' },
      { min: 18, max: 24, color: '#52c41a', icon: 'mdi:thermometer', label: 'Comfortable' },
      { min: 24, max: 28, color: '#faad14', icon: 'mdi:thermometer-high', label: 'Warm' },
      { min: 28, color: '#f5222d', icon: 'mdi:fire', label: 'Hot', warning: true },
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
      { max: 30, color: '#faad14', icon: 'mdi:water-minus', label: 'Dry', warning: true },
      { min: 30, max: 40, color: '#52c41a', icon: 'mdi:water-percent', label: 'Low' },
      { min: 40, max: 60, color: '#1890ff', icon: 'mdi:water-percent', label: 'Optimal' },
      { min: 60, max: 70, color: '#13c2c2', icon: 'mdi:water-percent', label: 'High' },
      { min: 70, color: '#f5222d', icon: 'mdi:water-plus', label: 'Humid', warning: true },
    ],
  },
  battery: {
    device_class: 'battery',
    icon: 'mdi:battery',
    unit: '%',
    precision: 0,
    ranges: [
      { max: 10, color: '#f5222d', icon: 'mdi:battery-10', label: 'Critical', warning: true },
      { min: 10, max: 20, color: '#fa8c16', icon: 'mdi:battery-20', label: 'Low', warning: true },
      { min: 20, max: 50, color: '#faad14', icon: 'mdi:battery-50', label: 'Medium' },
      { min: 50, max: 80, color: '#52c41a', icon: 'mdi:battery-70', label: 'Good' },
      { min: 80, color: '#1890ff', icon: 'mdi:battery', label: 'Full' },
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
      { max: 980, color: '#f5222d', icon: 'mdi:weather-pouring', label: 'Low' },
      { min: 980, max: 1000, color: '#faad14', icon: 'mdi:weather-cloudy', label: 'Variable' },
      { min: 1000, max: 1020, color: '#52c41a', icon: 'mdi:weather-partly-cloudy', label: 'Normal' },
      { min: 1020, color: '#1890ff', icon: 'mdi:weather-sunny', label: 'High' },
    ],
  },
  illuminance: {
    device_class: 'illuminance',
    icon: 'mdi:brightness-5',
    unit: 'lx',
    precision: 0,
    ranges: [
      { max: 1, color: '#1a1a1a', icon: 'mdi:brightness-1', label: 'Dark' },
      { min: 1, max: 50, color: '#595959', icon: 'mdi:brightness-2', label: 'Dim' },
      { min: 50, max: 200, color: '#8c8c8c', icon: 'mdi:brightness-4', label: 'Moderate' },
      { min: 200, max: 500, color: '#bfbfbf', icon: 'mdi:brightness-5', label: 'Bright' },
      { min: 500, color: '#fafafa', icon: 'mdi:brightness-7', label: 'Very Bright' },
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
      { max: 10, color: '#52c41a', icon: 'mdi:flash-off', label: 'Low' },
      { min: 10, max: 100, color: '#1890ff', icon: 'mdi:flash-outline', label: 'Medium' },
      { min: 100, max: 500, color: '#faad14', icon: 'mdi:flash', label: 'High' },
      { min: 500, color: '#f5222d', icon: 'mdi:flash-alert', label: 'Very High', warning: true },
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
      { max: 1, color: '#52c41a', icon: 'mdi:leaf', label: 'Low' },
      { min: 1, max: 5, color: '#1890ff', icon: 'mdi:lightning-bolt-outline', label: 'Medium' },
      { min: 5, max: 10, color: '#faad14', icon: 'mdi:lightning-bolt', label: 'High' },
      { min: 10, color: '#f5222d', icon: 'mdi:alert', label: 'Very High' },
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
      { max: 600, color: '#52c41a', icon: 'mdi:check-circle', label: 'Excellent' },
      { min: 600, max: 800, color: '#1890ff', icon: 'mdi:information', label: 'Good' },
      { min: 800, max: 1000, color: '#faad14', icon: 'mdi:alert-circle', label: 'Moderate' },
      { min: 1000, max: 1500, color: '#fa8c16', icon: 'mdi:alert', label: 'Poor', warning: true },
      { min: 1500, color: '#f5222d', icon: 'mdi:alert-octagon', label: 'Bad', warning: true },
    ],
  },
  volatile_organic_compounds: {
    device_class: 'volatile_organic_compounds',
    icon: 'mdi:air-filter',
    unit: 'µg/m³',
    precision: 0,
    ranges: [
      { max: 50, color: '#52c41a', label: 'Excellent' },
      { min: 50, max: 100, color: '#1890ff', label: 'Good' },
      { min: 100, max: 300, color: '#faad14', label: 'Moderate' },
      { min: 300, max: 500, color: '#fa8c16', label: 'Poor', warning: true },
      { min: 500, color: '#f5222d', label: 'Bad', warning: true },
    ],
  },
  pm25: {
    device_class: 'pm25',
    icon: 'mdi:dots-hexagon',
    unit: 'µg/m³',
    precision: 0,
    ranges: [
      { max: 12, color: '#52c41a', label: 'Good' },
      { min: 12, max: 35, color: '#faad14', label: 'Moderate' },
      { min: 35, max: 55, color: '#fa8c16', label: 'Unhealthy for Sensitive', warning: true },
      { min: 55, color: '#f5222d', label: 'Unhealthy', warning: true },
    ],
  },
  signal_strength: {
    device_class: 'signal_strength',
    icon: 'mdi:wifi',
    unit: 'dBm',
    precision: 0,
    ranges: [
      { max: -90, color: '#f5222d', icon: 'mdi:wifi-strength-1', label: 'Weak' },
      { min: -90, max: -70, color: '#faad14', icon: 'mdi:wifi-strength-2', label: 'Fair' },
      { min: -70, max: -50, color: '#52c41a', icon: 'mdi:wifi-strength-3', label: 'Good' },
      { min: -50, color: '#1890ff', icon: 'mdi:wifi-strength-4', label: 'Excellent' },
    ],
  },
};
