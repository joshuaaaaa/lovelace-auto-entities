import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  EntityDisplayConfig,
  ProcessedEntity,
  GroupedEntities,
  DEFAULT_ENTITY_TYPES,
  ValueRange,
  EntityTypeConfig,
} from './entity-display-types';
import { modernStyles } from './entity-display-modern-styles.css';
import { localize, getLanguage } from './localize';
import './editor/entity-display-editor';

class EntityDisplayCard extends LitElement {
  @property() public hass: any;
  @state() private _config: EntityDisplayConfig;
  @state() private _entities: ProcessedEntity[] = [];
  @state() private _groupedEntities: GroupedEntities = {};

  static getConfigElement() {
    return document.createElement('entity-display-editor');
  }

  static getStubConfig(): EntityDisplayConfig {
    return {
      type: 'custom:entity-display-card',
      title: 'Senzory',
      layout: 'list',
      group_by: 'type',
      show_header: true,
      show_state: true,
      show_icon: true,
      show_name: true,
      show_unit: true,
      show_last_changed: false,
      show_graph: false,
      columns: 2,
      theme: 'default',
      entity_types: [],
    };
  }

  setConfig(config: EntityDisplayConfig) {
    if (!config) {
      throw new Error('Chybí konfigurace karty');
    }

    this._config = {
      ...EntityDisplayCard.getStubConfig(),
      ...config,
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  updated(changedProps: Map<string, any>) {
    super.updated(changedProps);
    if (changedProps.has('hass') || changedProps.has('_config')) {
      this._updateEntities();
    }
  }

  private _updateEntities() {
    if (!this.hass || !this._config) return;

    let entities: ProcessedEntity[] = [];
    const invalidStates = ['unknown', 'none', 'unavailable', 'null', 'undefined', 'normal'];

    // Získání entit ze konfigurace
    const entityIds = this._getEntityIds();

    for (const entityId of entityIds) {
      const stateObj = this.hass.states[entityId];
      if (!stateObj) continue;

      const state = String(stateObj.state).toLowerCase();

      // Filtrování neplatných stavů pokud je zapnuto
      if (this._config.ignore_invalid) {
        if (invalidStates.includes(state)) {
          continue;
        }

        // Filtr pro číselné hodnoty - zkontroluje, jestli je stav číslo
        const numericValue = parseFloat(stateObj.state);
        if (isNaN(numericValue) || !isFinite(numericValue)) {
          continue;
        }
      }

      const processed = this._processEntity(entityId, stateObj);
      if (processed) {
        entities.push(processed);
      }
    }

    // Seřazení entit
    entities = this._sortEntities(entities);

    // Limitování počtu zobrazených entit
    if (this._config.max_entities && this._config.max_entities > 0) {
      entities = entities.slice(0, this._config.max_entities);
    }

    this._entities = entities;

    // Seskupení entit pokud je požadováno
    if (this._config.group_by && this._config.group_by !== 'none') {
      this._groupedEntities = this._groupEntities(entities);
    }
  }

  private _getEntityIds(): string[] {
    const entityIds: Set<string> = new Set();

    // Manuálně zadané entity
    if (this._config.entities) {
      this._config.entities.forEach((e) => entityIds.add(e));
    }

    // Entity z filtru
    if (this._config.filter && this.hass) {
      const allEntities = Object.keys(this.hass.states);

      for (const entityId of allEntities) {
        const stateObj = this.hass.states[entityId];

        // Include filtr
        if (this._config.filter.include) {
          for (const rule of this._config.filter.include) {
            if (this._matchesFilter(entityId, stateObj, rule)) {
              entityIds.add(entityId);
            }
          }
        }

        // Domain filtr
        if (this._config.filter.domain) {
          const domain = entityId.split('.')[0];
          if (this._config.filter.domain.includes(domain)) {
            entityIds.add(entityId);
          }
        }

        // Device class filtr
        if (this._config.filter.device_class) {
          const deviceClass = stateObj.attributes.device_class;
          if (deviceClass && this._config.filter.device_class.includes(deviceClass)) {
            entityIds.add(entityId);
          }
        }
      }

      // Exclude filtr
      if (this._config.filter.exclude) {
        for (const entityId of Array.from(entityIds)) {
          const stateObj = this.hass.states[entityId];
          for (const rule of this._config.filter.exclude) {
            if (this._matchesFilter(entityId, stateObj, rule)) {
              entityIds.delete(entityId);
            }
          }
        }
      }
    }

    return Array.from(entityIds);
  }

  private _matchesFilter(entityId: string, stateObj: any, rule: any): boolean {
    if (rule.domain) {
      const domain = entityId.split('.')[0];
      if (domain !== rule.domain) return false;
    }

    if (rule.device_class) {
      if (stateObj.attributes.device_class !== rule.device_class) return false;
    }

    if (rule.entity_id) {
      const pattern = new RegExp(rule.entity_id.replace(/\*/g, '.*'));
      if (!pattern.test(entityId)) return false;
    }

    if (rule.area) {
      // Implementace area filtru (vyžaduje registr entit)
      // Pro zjednodušení zatím přeskočeno
    }

    if (rule.state) {
      if (stateObj.state !== rule.state) return false;
    }

    if (rule.attributes) {
      for (const [key, value] of Object.entries(rule.attributes)) {
        if (stateObj.attributes[key] !== value) return false;
      }
    }

    return true;
  }

  private _processEntity(entityId: string, stateObj: any): ProcessedEntity | null {
    const deviceClass = stateObj.attributes.device_class || 'unknown';
    const domain = entityId.split('.')[0];

    // Získání konfigurace pro typ entity
    const typeConfig = this._getTypeConfig(deviceClass, domain);

    // Zpracování hodnoty
    let state: string | number = stateObj.state;
    const numericValue = parseFloat(String(state));
    if (!isNaN(numericValue) && isFinite(numericValue)) {
      state = numericValue;
      if (typeConfig.precision !== undefined) {
        state = parseFloat(numericValue.toFixed(typeConfig.precision));
      }
    }

    // Získání range konfigurace
    const range = this._getValueRange(state, typeConfig);

    // Zpracování jednotek
    let unit = stateObj.attributes.unit_of_measurement || typeConfig.unit || '';

    return {
      entity_id: entityId,
      name: stateObj.attributes.friendly_name || entityId,
      state,
      unit,
      icon: range?.icon || typeConfig.icon || this._getDefaultIcon(domain),
      color: range?.color || this._getDefaultColor(deviceClass),
      device_class: deviceClass,
      area: stateObj.attributes.area,
      floor: stateObj.attributes.floor,
      last_changed: new Date(stateObj.last_changed),
      attributes: stateObj.attributes,
      warning: range?.warning || false,
    };
  }

  private _getTypeConfig(deviceClass: string, domain: string): EntityTypeConfig {
    // Vlastní konfigurace z karty
    const customConfig = this._config.entity_types?.find(
      (t) => t.device_class === deviceClass
    );

    if (customConfig) {
      return customConfig;
    }

    // Defaultní konfigurace
    if (DEFAULT_ENTITY_TYPES[deviceClass]) {
      return DEFAULT_ENTITY_TYPES[deviceClass];
    }

    // Fallback
    return {
      device_class: deviceClass,
      icon: 'mdi:eye',
      precision: 1,
    };
  }

  private _getValueRange(state: string | number, config: EntityTypeConfig): ValueRange | null {
    if (!config.ranges || typeof state !== 'number') {
      return null;
    }

    for (const range of config.ranges) {
      const minMatch = range.min === undefined || state >= range.min;
      const maxMatch = range.max === undefined || state <= range.max;

      if (minMatch && maxMatch) {
        return range;
      }
    }

    return null;
  }

  private _getDefaultIcon(domain: string): string {
    const iconMap: Record<string, string> = {
      sensor: 'mdi:eye',
      binary_sensor: 'mdi:checkbox-marked-circle',
      light: 'mdi:lightbulb',
      switch: 'mdi:light-switch',
      climate: 'mdi:thermostat',
      fan: 'mdi:fan',
      cover: 'mdi:window-shutter',
      lock: 'mdi:lock',
      media_player: 'mdi:speaker',
      camera: 'mdi:camera',
    };

    return iconMap[domain] || 'mdi:eye';
  }

  private _getDefaultColor(deviceClass: string): string {
    return '#44739e'; // Defaultní modrá barva Home Assistant
  }

  private _groupEntities(entities: ProcessedEntity[]): GroupedEntities {
    const grouped: GroupedEntities = {};

    for (const entity of entities) {
      let key: string;

      switch (this._config.group_by) {
        case 'type':
          key = entity.device_class || 'Ostatní';
          break;
        case 'area':
          key = entity.area || 'Bez oblasti';
          break;
        case 'floor':
          key = entity.floor || 'Bez patra';
          break;
        default:
          key = 'Všechny';
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(entity);
    }

    // Seřazení skupin
    for (const key in grouped) {
      grouped[key] = this._sortEntities(grouped[key]);
    }

    return grouped;
  }

  private _sortEntities(entities: ProcessedEntity[]): ProcessedEntity[] {
    if (!this._config.sort_by) {
      return entities;
    }

    const sorted = entities.sort((a, b) => {
      let result = 0;

      switch (this._config.sort_by) {
        case 'name':
          result = a.name.localeCompare(b.name);
          break;
        case 'state':
          let valA = parseFloat(String(a.state));
          let valB = parseFloat(String(b.state));
          if (isNaN(valA)) valA = 0;
          if (isNaN(valB)) valB = 0;
          result = valA - valB;
          break;
        case 'last_changed':
          result = b.last_changed.getTime() - a.last_changed.getTime();
          break;
        case 'area':
          result = (a.area || '').localeCompare(b.area || '');
          break;
        default:
          result = 0;
      }

      // Aplikovat reverse pokud je nastaveno
      return this._config.sort_reverse ? -result : result;
    });

    return sorted;
  }

  private _renderEntity(entity: ProcessedEntity) {
    const layout = this._config.layout || 'list';

    switch (layout) {
      case 'grid':
        return this._renderGridEntity(entity);
      case 'gauge':
        return this._renderGaugeEntity(entity);
      case 'compact':
        return this._renderCompactEntity(entity);
      case 'detailed':
        return this._renderDetailedEntity(entity);
      default:
        return this._renderListEntity(entity);
    }
  }

  private _renderListEntity(entity: ProcessedEntity) {
    return html`
      <div class="entity-row ${entity.warning ? 'warning' : ''}" @click=${() => this._handleEntityClick(entity)}>
        ${this._config.show_icon !== false
          ? html`<ha-icon class="entity-icon" .icon=${entity.icon} style="color: ${entity.color}"></ha-icon>`
          : ''}
        <div class="entity-info">
          ${this._config.show_name !== false
            ? html`<div class="entity-name">${entity.name}</div>`
            : ''}
          ${this._config.show_last_changed
            ? html`<div class="entity-secondary">${this._formatLastChanged(entity.last_changed)}</div>`
            : ''}
        </div>
        ${this._config.show_state !== false
          ? html`
              <div class="entity-state">
                <span class="state-value">${entity.state}</span>
                ${this._config.show_unit !== false && entity.unit
                  ? html`<span class="state-unit">${entity.unit}</span>`
                  : ''}
              </div>
            `
          : ''}
      </div>
    `;
  }

  private _renderGridEntity(entity: ProcessedEntity) {
    return html`
      <div class="grid-item ${entity.warning ? 'warning' : ''}" @click=${() => this._handleEntityClick(entity)}>
        <div class="grid-icon" style="background-color: ${entity.color}20; color: ${entity.color}">
          <ha-icon .icon=${entity.icon}></ha-icon>
        </div>
        <div class="grid-content">
          <div class="grid-name">${entity.name}</div>
          <div class="grid-state">
            <span class="state-value">${entity.state}</span>
            ${entity.unit ? html`<span class="state-unit">${entity.unit}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  private _renderGaugeEntity(entity: ProcessedEntity) {
    const typeConfig = this._getTypeConfig(entity.device_class || '', entity.entity_id.split('.')[0]);
    const percentage = this._calculatePercentage(entity.state, typeConfig);

    return html`
      <div class="gauge-item ${entity.warning ? 'warning' : ''}" @click=${() => this._handleEntityClick(entity)}>
        <div class="gauge-header">
          <ha-icon class="gauge-icon" .icon=${entity.icon}></ha-icon>
          <span class="gauge-name">${entity.name}</span>
        </div>
        <div class="gauge-bar-container">
          <div class="gauge-bar" style="width: ${percentage}%; background-color: ${entity.color}"></div>
        </div>
        <div class="gauge-value">
          ${entity.state}${entity.unit ? ` ${entity.unit}` : ''}
        </div>
      </div>
    `;
  }

  private _renderCompactEntity(entity: ProcessedEntity) {
    return html`
      <div class="compact-item ${entity.warning ? 'warning' : ''}" @click=${() => this._handleEntityClick(entity)}>
        <ha-icon .icon=${entity.icon} style="color: ${entity.color}"></ha-icon>
        <span class="compact-value">${entity.state}</span>
        ${entity.unit ? html`<span class="compact-unit">${entity.unit}</span>` : ''}
      </div>
    `;
  }

  private _renderDetailedEntity(entity: ProcessedEntity) {
    const typeConfig = this._getTypeConfig(entity.device_class || '', entity.entity_id.split('.')[0]);
    const range = this._getValueRange(entity.state, typeConfig);

    const graphHeight = this._config.graph_height || 100;

    return html`
      <div class="detailed-item ${entity.warning ? 'warning' : ''}" data-entity-id="${entity.entity_id}" @click=${() => this._handleEntityClick(entity)}>
        <div class="detailed-header">
          <div class="detailed-icon" style="background: ${entity.color}">
            <ha-icon .icon=${entity.icon}></ha-icon>
          </div>
          <div class="detailed-info">
            <div class="detailed-name">${entity.name}</div>
            <div class="detailed-meta">
              ${entity.area ? html`<span class="meta-area">${entity.area}</span>` : ''}
              ${range?.label ? html`<span class="meta-label">${range.label}</span>` : ''}
            </div>
          </div>
          <div class="detailed-state">
            <div class="state-value">${entity.state}</div>
            ${entity.unit ? html`<div class="state-unit">${entity.unit}</div>` : ''}
          </div>
        </div>
        ${this._config.show_graph && typeConfig.show_graph
          ? html`<div class="detailed-graph">
              ${this._renderGraph(entity, this.offsetWidth - 32 || 300, graphHeight)}
            </div>`
          : ''}
        <div class="detailed-footer">
          <span>${localize('time_last_changed', getLanguage(this.hass))}: ${this._formatLastChanged(entity.last_changed)}</span>
        </div>
      </div>
    `;
  }

  private _calculatePercentage(state: string | number, config: EntityTypeConfig): number {
    if (typeof state !== 'number' || !config.ranges) {
      return 50;
    }

    const ranges = config.ranges;
    const min = ranges[0]?.min ?? 0;
    const max = ranges[ranges.length - 1]?.max ?? 100;

    const percentage = ((state - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  private _formatLastChanged(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const lang = getLanguage(this.hass);
    const timeAgo = localize('time_minutes_ago', lang);

    if (days > 0) return `${timeAgo} ${days}d`;
    if (hours > 0) return `${timeAgo} ${hours}h`;
    if (minutes > 0) return `${timeAgo} ${minutes}m`;
    return localize('time_now', lang);
  }

  private async _fetchHistory(entityId: string, hours: number = 24): Promise<number[][]> {
    if (!this.hass) return [];

    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - hours * 60 * 60 * 1000);

    try {
      // Používáme REST API endpoint jako mini-graph-card
      const url = `history/period/${startTime.toISOString()}?filter_entity_id=${entityId}&end_time=${endTime.toISOString()}&minimal_response&no_attributes&significant_changes_only=0`;

      const history = await this.hass.callApi('GET', url);

      if (!history || !history[0] || history[0].length === 0) {
        return [];
      }

      // Zpracování dat - [timestamp, value]
      const dataPoints: number[][] = [];
      for (const point of history[0]) {
        let value: number;
        let timestamp: number;

        // Minimal response format (s = state, lu = last_updated in seconds)
        if (point.s !== undefined) {
          value = parseFloat(String(point.s));
          timestamp = point.lu * 1000; // lu je v sekundách, převedeme na milisekundy
        }
        // Standard format
        else if (point.state !== undefined) {
          value = parseFloat(String(point.state));
          timestamp = new Date(point.last_changed || point.last_updated).getTime();
        }
        else {
          continue;
        }

        if (!isNaN(value) && isFinite(value)) {
          dataPoints.push([timestamp, value]);
        }
      }

      if (dataPoints.length === 0) {
        return [];
      }

      // Agregace dat pokud je jich příliš mnoho (max 100 bodů)
      if (dataPoints.length > 100) {
        return this._aggregateDataPoints(dataPoints, 100);
      }

      return dataPoints;
    } catch (error) {
      console.error(`Error fetching history for ${entityId}:`, error);
      return [];
    }
  }

  private _aggregateDataPoints(dataPoints: number[][], targetPoints: number): number[][] {
    if (dataPoints.length <= targetPoints) return dataPoints;

    const bucketSize = Math.ceil(dataPoints.length / targetPoints);
    const aggregated: number[][] = [];

    for (let i = 0; i < dataPoints.length; i += bucketSize) {
      const bucket = dataPoints.slice(i, i + bucketSize);
      const avgTimestamp = bucket.reduce((sum, p) => sum + p[0], 0) / bucket.length;
      const avgValue = bucket.reduce((sum, p) => sum + p[1], 0) / bucket.length;
      aggregated.push([avgTimestamp, avgValue]);
    }

    return aggregated;
  }

  private _renderGraph(entity: ProcessedEntity, width: number = 300, height: number = 80) {
    const typeConfig = this._getTypeConfig(entity.device_class || '', entity.entity_id.split('.')[0]);
    const graphHours = this._config.graph_hours || typeConfig.graph_hours || 24;
    const graphType = this._config.graph_type || 'line';
    const lineColor = this._config.graph_line_color || entity.color;
    const fill = this._config.graph_fill !== false;

    // Načteme historii asynchronně
    this._fetchHistory(entity.entity_id, graphHours).then((dataPoints) => {
      if (dataPoints.length === 0 || dataPoints.length < 2) {
        return;
      }

      // Najdeme min a max hodnoty pro škálování
      const values = dataPoints.map(d => d[1]);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      const range = maxValue - minValue || 1;

      // Padding pro graf
      const padding = 10;
      const graphWidth = width - padding * 2;
      const graphHeight = height - padding * 2;

      // Vytvoření bodů pro graf
      const points: Array<{x: number, y: number, value: number}> = dataPoints.map((point, index) => {
        const x = padding + (index / (dataPoints.length - 1)) * graphWidth;
        const y = padding + graphHeight - ((point[1] - minValue) / range) * graphHeight;
        return { x, y, value: point[1] };
      });

      let pathData = '';
      let fillPath = '';

      if (graphType === 'line' || graphType === 'area') {
        // Vytvoříme smooth curve pomocí kvadratických Bézier křivek
        pathData = this._createSmoothPath(points);

        // Pro area graf přidáme fill path
        if (fill && graphType === 'area') {
          fillPath = `${pathData} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;
        }
      } else {
        // Bar chart
        pathData = this._createBarPath(dataPoints, minValue, range, padding, graphWidth, graphHeight);
      }

      // Aktualizujeme DOM element s grafem
      requestAnimationFrame(() => {
        // Escapujeme entity ID pro bezpečný querySelector
        const safeEntityId = entity.entity_id.replace(/[.]/g, '\\.');
        const graphContainer = this.shadowRoot?.querySelector(
          `[data-entity-id="${safeEntityId}"] .detailed-graph svg`
        );

        if (!graphContainer) {
          return;
        }

        const gridLines = this._createGridLines(width, height, padding, minValue, maxValue);
        const gradientId = entity.entity_id.replace(/[.:]/g, '_');

        graphContainer.innerHTML = `
          <defs>
            <linearGradient id="gradient-${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:${lineColor};stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:${lineColor};stop-opacity:0.05" />
            </linearGradient>
          </defs>
          ${gridLines}
          ${fill && fillPath ? `<path d="${fillPath}" fill="url(#gradient-${gradientId})" />` : ''}
          <path d="${pathData}" stroke="${lineColor}" stroke-width="2" fill="${fill && !fillPath ? lineColor : 'none'}" opacity="${fill && !fillPath ? '0.3' : '1'}" stroke-linecap="round" stroke-linejoin="round"/>
          ${this._createValueLabels(minValue, maxValue, height, padding)}
        `;
      });
    }).catch(error => {
      console.error(`Error rendering graph for ${entity.entity_id}:`, error);
    });

    // Vrátíme placeholder SVG, který bude aktualizován
    return html`
      <svg width="${width}" height="${height}" style="display: block; background: transparent;">
        <text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="var(--secondary-text-color)" font-size="11">
          ${localize('loading', getLanguage(this.hass))}
        </text>
      </svg>
    `;
  }

  private _createSmoothPath(points: Array<{x: number, y: number, value: number}>): string {
    if (points.length < 2) return '';

    // Začneme přesunem na první bod
    let path = `M ${points[0].x},${points[0].y}`;

    // Pro lepší smooth efekt použijeme jednodušší přístup - přímé čáry
    // (Kvadratické Bézier křivky byly špatně implementované)
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x},${points[i].y}`;
    }

    return path;
  }

  private _createGridLines(width: number, height: number, padding: number, minValue: number, maxValue: number): string {
    const lines: string[] = [];
    const numLines = 3;

    for (let i = 0; i <= numLines; i++) {
      const y = padding + (height - padding * 2) * (i / numLines);
      lines.push(`<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="var(--divider-color)" stroke-width="0.5" opacity="0.3"/>`);
    }

    return lines.join('');
  }

  private _formatGraphValue(value: number): string {
    // Inteligentní formátování podle velikosti hodnoty
    if (Math.abs(value) >= 100) {
      return value.toFixed(0); // Pro velké hodnoty bez desetinných míst
    } else if (Math.abs(value) >= 10) {
      return value.toFixed(1); // Pro střední hodnoty jedno desetinné místo
    } else {
      return value.toFixed(2); // Pro malé hodnoty dvě desetinná místa
    }
  }

  private _createValueLabels(minValue: number, maxValue: number, height: number, padding: number): string {
    return `
      <text x="2" y="${padding + 10}" fill="var(--secondary-text-color)" font-size="9" opacity="0.7">${this._formatGraphValue(maxValue)}</text>
      <text x="2" y="${height - padding + 2}" fill="var(--secondary-text-color)" font-size="9" opacity="0.7">${this._formatGraphValue(minValue)}</text>
    `;
  }

  private _createBarPath(dataPoints: number[][], minValue: number, range: number, padding: number, width: number, height: number): string {
    const barWidth = width / dataPoints.length;
    const bars = dataPoints.map((point, index) => {
      const x = padding + index * barWidth;
      const barHeight = ((point[1] - minValue) / range) * height;
      const y = padding + height - barHeight;
      return `M ${x},${y} L ${x},${padding + height} L ${x + barWidth * 0.8},${padding + height} L ${x + barWidth * 0.8},${y} Z`;
    });
    return bars.join(' ');
  }

  private _handleEntityClick(entity: ProcessedEntity) {
    const event = new CustomEvent('hass-more-info', {
      detail: { entityId: entity.entity_id },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _getGroupTitle(key: string): string {
    const lang = getLanguage(this.hass);

    // Map device class keys to localization keys
    const deviceClassMap: Record<string, keyof import('./localize').Translations> = {
      temperature: 'device_temperature',
      humidity: 'device_humidity',
      battery: 'device_battery',
      pressure: 'device_pressure',
      illuminance: 'device_illuminance',
      power: 'device_power',
      energy: 'device_energy',
      carbon_dioxide: 'device_carbon_dioxide',
      volatile_organic_compounds: 'device_volatile_organic_compounds',
      pm25: 'device_pm25',
      signal_strength: 'device_signal_strength',
      unknown: 'device_other',
      'Bez oblasti': 'group_no_area',
      'Bez patra': 'group_no_floor',
      'Všechny': 'group_all',
    };

    const locKey = deviceClassMap[key];
    return locKey ? localize(locKey, lang) : key;
  }

  render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    const lang = getLanguage(this.hass);
    const allKey = localize('group_all', lang);

    const entities = this._config.group_by && this._config.group_by !== 'none'
      ? this._groupedEntities
      : { [allKey]: this._entities };

    const isEmpty = Object.keys(entities).length === 0 ||
                    Object.values(entities).every(group => group.length === 0);

    if (isEmpty) {
      return html`
        <ha-card>
          <div class="empty-state">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <p>${localize('empty_no_entities', lang)}</p>
          </div>
        </ha-card>
      `;
    }

    const layout = this._config.layout || 'list';
    const columns = this._config.columns || 2;

    return html`
      <ha-card>
        ${this._config.show_header !== false && this._config.title
          ? html`<div class="card-header">${this._config.title}</div>`
          : ''}
        <div class="card-content ${layout}-layout" style="--columns: ${columns}">
          ${Object.entries(entities).map(([groupKey, groupEntities]) => {
            if (groupEntities.length === 0) return '';

            return html`
              ${this._config.group_by && this._config.group_by !== 'none'
                ? html`<div class="group-header">${this._getGroupTitle(groupKey)}</div>`
                : ''}
              <div class="entities-container ${layout}-container">
                ${groupEntities.map((entity) => this._renderEntity(entity))}
              </div>
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  static styles = modernStyles;

  getCardSize() {
    const entityCount = this._entities.length;
    const layout = this._config.layout || 'list';

    switch (layout) {
      case 'compact':
        return Math.ceil(entityCount / (this._config.columns || 3)) + 1;
      case 'grid':
        return Math.ceil(entityCount / (this._config.columns || 2)) * 2 + 1;
      case 'detailed':
        return entityCount * 3 + 1;
      default:
        return entityCount + 1;
    }
  }
}

customElements.define('entity-display-card', EntityDisplayCard);

// Registrace karty v window pro Home Assistant
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'entity-display-card',
  name: 'Entity Display Card',
  description: 'Pokročilá karta pro zobrazení entit s filtry a vizualizacemi',
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    'entity-display-card': EntityDisplayCard;
  }
}
